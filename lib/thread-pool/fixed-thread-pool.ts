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
  private freeWorkers: Worker[];

  private queue: Array<
    [
      ThreadPool.Runnable<any, any>,
      any,
      (result: any) => void,
      (err: Error) => void
    ]
  >;

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
    this.queue = [];
  }

  public submit = <T, D>(
    fn: ThreadPool.Runnable<T, D>,
    data?: D
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      this.queue.push([fn, data, resolve, reject]);
      this.executeNext();
    });
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

      subChannel.port2.on(
        "message",
        ({ action, payload: { result, msg } }: ThreadWorker.IResultAction) => {
          if (action === Actions.RESULT) {
            this.freeWorkers.push(worker);
            this.executeNext();
            success(deserialize(result));
          } else if (action === Actions.ERROR) {
            this.freeWorkers.push(worker);
            this.executeNext();
            const e = deserialize(result);
            e.message = msg;
            error(e);
          }
        }
      );

      worker.postMessage(
        ThreadWorker.createRunAction({
          data:
            data instanceof SharedArrayBuffer || !data
              ? data
              : serialize(data) || {},
          port: subChannel.port1,
          rawData,
          runnable: serialize(runnable)
        }),
        [subChannel.port1]
      );
    }
  };
}
