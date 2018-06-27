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
parentPort.on('message', ({ action, payload: { port, runnable, data, rawData } }) => {
  if (action === "__run__") {
    try {
      const hydratedData = data && (data instanceof SharedArrayBuffer ? data : Object.assign(deserialize(data), rawData));
      deserialize(runnable)(hydratedData).then((result) => {
        port.postMessage({ action: "__result__", payload: { result: serialize(result) } });
      })
    } catch (e) {
      port.postMessage({ action: "__error__", payload: { result: serialize(e), msg: e.message, error: true } });
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
          action: "__run__",
          payload: {
            data:
              data instanceof SharedArrayBuffer || !data
                ? data
                : serialize(data) || {},
            port: subChannel.port1,
            rawData,
            runnable: serialize(runnable)
          }
        },
        [subChannel.port1]
      );
      subChannel.port2.on(
        "message",
        ({
          action,
          payload: { result, msg }
        }: {
          action: string;
          payload: {
            result: any;
            msg: string;
          };
        }) => {
          if (action === "__result__") {
            this.freeWorkers.push(worker);
            this.executeNext();
            success(deserialize(result));
          } else if (action === "__error__") {
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
