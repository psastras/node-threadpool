/**
 * @module FixedThreadPool
 */

import {
  MessageChannel,
  MessagePortEvent,
  parentPort,
  Worker,
  WorkerOptions
} from "worker_threads";
import { serialize } from "./serialize";
import { ThreadPool } from "./thread-pool";

const workerThread = `
const { parentPort } = require('worker_threads');

const deserialize = (serialized) => {
  const reviver = (_, value) => {
    if (typeof value === "string") {
      try {
        if (value.indexOf("function ") === 0) {
          let functionTemplate = \`(\${value})\`;
          return eval(functionTemplate);
        } else {
          return eval(value);
        }
      } catch {
        return value
      }
    }
    return value;
  };
  return JSON.parse(serialized, reviver);
};

parentPort.on('message', ({ value, port, runnable, data }) => {
  if (value === "__run__") {
    try {
      deserialize(runnable)(data).then((result) => {
        port.postMessage({ value: "__result__", result });
      })
    } catch (e) {
      port.postMessage({ value: "__error__", result: e.message });
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
      (err: string) => void
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
        (msg: string) => {
          reject(new Error(msg));
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
    err: (msg: string) => void
  ): any => {
    this.queue.push([fn, data, success, err]);
    this.executeNext();
  };

  private executeNext = (): any => {
    if (this.queue.length > 0 && this.freeWorkers.length > 0) {
      const [runnable, data, success, error] = this.queue.shift()!;
      const worker = this.freeWorkers.shift()!;
      const subChannel = new MessageChannel();
      worker.postMessage(
        {
          data: data || {},
          port: subChannel.port1,
          runnable: serialize(runnable),
          value: "__run__"
        },
        [subChannel.port1]
      );
      subChannel.port2.on(
        "message",
        ({ result, value }: { result: any; value: string }) => {
          if (value === "__result__") {
            this.freeWorkers.push(worker);
            this.executeNext();
            success(result);
          } else if (value === "__error__") {
            this.freeWorkers.push(worker);
            this.executeNext();
            error(result);
          }
        }
      );
    }
  };
}
