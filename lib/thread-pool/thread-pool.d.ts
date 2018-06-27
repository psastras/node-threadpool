/**
 * @module ThreadPool
 */

export namespace ThreadPool {
  export interface IThreadPool {
    submit: <T, D>(fn: (data?: D) => Promise<T>, data?: D) => Promise<T>;
  }
}
