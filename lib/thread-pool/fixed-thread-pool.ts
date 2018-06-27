/**
 * @module FixedThreadPool
 */

import { deserialize, serialize } from "surrial";
import { isObject } from "util";
import {
  MessageChannel,
  MessagePortEvent,
  parentPort,
  Worker,
  WorkerOptions
} from "worker_threads";
import { ThreadPool } from "./thread-pool";

const workerThread = `
const { parentPort } = require('worker_threads');
const { serialize, deserialize } = require('surrial');
parentPort.on('message', ({ value, port, runnable, data, rawData }) => {
  if (value === "__run__") {
    try {
      const hydratedData = data && (data instanceof SharedArrayBuffer ? data : Object.assign(deserialize(data), rawData));
      deserialize(runnable)(hydratedData).then((result) => {
        port.postMessage({ value: "__result__", result: serialize(result) });
      })
    } catch (e) {
      port.postMessage({ value: "__error__", result: serialize(e), msg: e.message });
    }
  }
});
`;

/**
 * @internal
 */
export class FixedThreadPool implements ThreadPool.IThreadPool {
  private freeWorkers: Worker[];

  private queue: Array<
    [
      (data?: any) => Promise<any>,
      any,
      (result: any) => void,
      (err: Error) => void
    ]
  >;

  constructor(
    private numThreads: number,
    private workerOptions: WorkerOptions = {}
  ) {
    this.freeWorkers = Array.from(Array(numThreads).keys()).map(() =>
      this.createWorker(workerOptions)
    );
    this.queue = [];
  }

  public submit = <T, D>(
    fn: (data?: D) => Promise<T>,
    data?: D
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      this.enqueue(
        fn,
        data,
        (result: T) => {
          resolve(result);
        },
        (err: Error) => {
          reject(err);
        }
      );
    });
  };

  private createWorker = (workerOptions: WorkerOptions): any => {
    return new Worker(workerThread, {
      ...workerOptions,
      eval: true
    });
  };

  private enqueue = <T, D>(
    fn: (data?: D) => Promise<T>,
    data: D,
    success: (result: T) => void,
    err: (err: Error) => void
  ): any => {
    this.queue.push([fn, data, success, err]);
    this.executeNext();
  };

  private executeNext = (): any => {
    if (this.queue.length > 0 && this.freeWorkers.length > 0) {
      const [runnable, data, success, error] = this.queue.shift()!;
      const worker = this.freeWorkers.shift()!;
      const subChannel = new MessageChannel();
      const rawData: any = {};

      if (typeof data === "object") {
        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof SharedArrayBuffer) {
            rawData[key] = value;
            delete data.key;
          }
        });
      }

      worker.postMessage(
        {
          data:
            data instanceof SharedArrayBuffer || !data
              ? data
              : serialize(data) || {},
          port: subChannel.port1,
          rawData,
          runnable: serialize(runnable),
          value: "__run__"
        },
        [subChannel.port1]
      );
      subChannel.port2.on(
        "message",
        ({
          result,
          value,
          msg
        }: {
          result: any;
          value: string;
          msg: string;
        }) => {
          if (value === "__result__") {
            this.freeWorkers.push(worker);
            this.executeNext();
            success(deserialize(result));
          } else if (value === "__error__") {
            this.freeWorkers.push(worker);
            this.executeNext();
            const e = deserialize(result);
            e.message = msg;
            error(e);
          }
        }
      );
    }
  };
}
