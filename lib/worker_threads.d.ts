/**
 * @module WorkerThreads
 */
declare module "worker_threads" {
  const _worker_threads: {
    Worker: any;
    MessageChannel: any;
    parentPort: any;
  };
  export = _worker_threads;
}
