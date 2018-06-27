/**
 * @module Executors
 */

import { FixedThreadPool } from "./thread-pool/fixed-thread-pool";
import { ThreadPool } from "./thread-pool/thread-pool";

/**
 * Utility methods for creating different types of thread pools.
 *
 * Example usage:
 *
 * ```javascript
 * import { Executors } from "node-threadpool";
 * const pool = Executors.newFixedThreadPool(4);
 *
 * // these execute in parallel (as long as the pool size >= 2)
 * const result1 = pool.submit(async () => "done 1");
 * const result2 = pool.submit(async () => "done 2");
 *
 * console.log(await result1); // joins and prints "done1"
 * console.log(await result2); // joins and prints "done2"
 * ```
 *
 */
export const Executors = {
  /**
   * Constructs a new fixed thread pool with the given number of threads.
   *
   * A fixed thread pool immediately creates its worker threads and maintains
   * that set amount of threads.  If a thread is terminated, threads will be recreated
   * to maintain a fixed size.
   *
   * Work submitted to this thread pool will be handed to a thread if available. If all
   * threads are busy, the work will be queued and executed in queue order as threads
   * free up.
   *
   * @argument numThreads The number of threads to keep in the pool
   * @returns A instance of {@link IThreadPool}
   */
  newFixedThreadPool: (numThreads: number): ThreadPool.IThreadPool =>
    new FixedThreadPool(numThreads),

  /**
   * Constructs a new  thread pool with a single worker thread.
   *
   * Work submitted to this thread pool will be handed to the thread if available. If
   * the thread is busy, the work will be queued and executed in queue order once the thread
   * frees up.
   *
   * @returns A instance of {@link IThreadPool}
   */
  newSingleThreadedExecutor: (): ThreadPool.IThreadPool =>
    new FixedThreadPool(1)
};
