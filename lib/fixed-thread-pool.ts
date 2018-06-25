/**
 * @module FixedThreadPool
 */
import { MessageChannel, parentPort, Worker } from "worker_threads";
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

parentPort.on('message', ({ value, port, runnable }) => {
  if (value === "__run__") {
    try {
      deserialize(runnable)().then((result) => {
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
    [() => Promise<any>, (result: any) => void, (err: string) => void]
  >;

  constructor(private numThreads: number) {
    this.freeWorkers = Array.from(Array(numThreads).keys()).map(() => {
      return new Worker(workerThread, {
        eval: true
      });
    });
    this.queue = [];
  }

  public submit = <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      this.enqueue(
        fn,
        (result: T) => {
          resolve(result);
        },
        (msg: string) => {
          reject(new Error(msg));
        }
      );
    });
  };

  private enqueue = <T>(
    fn: () => Promise<T>,
    success: (result: T) => void,
    err: (msg: string) => void
  ): any => {
    this.queue.push([fn, success, err]);
    this.executeNext();
  };

  private executeNext = (): any => {
    if (this.queue.length > 0 && this.freeWorkers.length > 0) {
      const [runnable, success, error] = this.queue.shift()!;
      const worker = this.freeWorkers.shift()!;
      const subChannel = new MessageChannel();
      worker.postMessage(
        {
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
