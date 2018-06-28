/**
 * @module ThreadPool
 */

export namespace ThreadPool {
  export type Runnable<T, D> = (data?: D) => Promise<T>;
  export interface IThreadPool {
    submit: <T, D>(fn: Runnable<T, D>, data?: D) => Promise<T>;
  }
}
