/**
 * @module ThreadPool
 */

import { MessageChannel } from "worker_threads";

export namespace ThreadPool {
  export type Runnable<T, D> = (data?: D) => Promise<T>;

  interface ISubmittedThread<T, D> {
    fn: ThreadPool.Runnable<T, D>;
    data: D;
    resolve: (result: T) => void;
    reject: (err: Error) => void;
  }
  export interface IThreadPool {
    submit: <T, D>(fn: Runnable<T, D>, data?: D) => Promise<T>;
  }
}
