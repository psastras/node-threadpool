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
import { Actions, ThreadWorker } from "./thread-worker";

export class FixedThreadPool implements ThreadPool.IThreadPool {
  private freeWorkers: Worker[] = [];
  private queue: Array<ThreadPool.ISubmittedThread<any, any>> = [];

  constructor(
    private numThreads: number,
    private workerOptions: WorkerOptions = {}
  ) {
    this.freeWorkers = Array.from(Array(numThreads).keys()).map(
      () =>
        new Worker(ThreadWorker.code, {
          ...workerOptions,
          eval: true
        })
    );
  }

  public submit = <T, D>(
    fn: ThreadPool.Runnable<T, D>,
    data?: D
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      this.queue.push({ fn, data, resolve, reject });
      this.executeNext();
    });
  };

  private executeNext = (): any => {
    if (this.queue.length > 0 && this.freeWorkers.length > 0) {
      const { fn, data, resolve, reject } = this.queue.shift()!;
      const worker = this.freeWorkers.shift()!;
      const rawData: any = {};

      if (typeof data === "object") {
        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof SharedArrayBuffer) {
            rawData[key] = value;
            delete data.key;
          }
        });
      }

      const channel = new MessageChannel();
      channel.port2.on(
        "message",
        ({ action, payload: { result, msg } }: ThreadWorker.IResultAction) => {
          if (action === Actions.RESULT) {
            this.freeWorkers.push(worker);
            this.executeNext();
            resolve(deserialize(result));
          } else if (action === Actions.ERROR) {
            this.freeWorkers.push(worker);
            this.executeNext();
            const e = deserialize(result);
            e.message = msg;
            reject(e);
          }
        }
      );

      worker.postMessage(
        ThreadWorker.createRunAction({
          data:
            data instanceof SharedArrayBuffer || !data
              ? data
              : serialize(data) || {},
          port: channel.port1,
          rawData,
          runnable: serialize(fn)
        }),
        [channel.port1]
      );
    }
  };
}
