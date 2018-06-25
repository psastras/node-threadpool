/**
 * @module ThreadPool
 */

export namespace ThreadPool {
  export interface IThreadPool {
    submit: <T>(fn: () => Promise<T>) => Promise<T>;
  }
}
