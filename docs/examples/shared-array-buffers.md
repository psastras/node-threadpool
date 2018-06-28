# Shared Array Buffers

Node's `worker_thread` API supports shared memory between threads. Unlike copying data directly to each worker, shared memory avoids the copy overhead and allows threads to communicate to each other by reading and writing to the same area of memory.

`node-threadpool` supports shared memory -- if you pass data of type
`SharedArrayBuffer` in the `submit` function, it will automatically be accessible from each thread.

In the following example, a shared buffer is created to hold a single integer. This integer is then written to in the first thread, and read and returned in the second thead. Note that we could also read and write to the same buffer from the main thread.

Also note that a single thread executor is used to avoid concurrent threads reading and writing to the same memory at the same time (see the next example using Atomics which does this safely).

```javascript
const buffer = new SharedArrayBuffer(1 * Int32Array.BYTES_PER_ELEMENT);
const array = new Int32Array(sharedBuffer); // provide a view onto the buffer

// theres no lock, so in order to write safely we'll use one thread for this toy example
// see the next example for atomic usage
const pool = Executors.newSingleThreadedExecutor();

// set the data in the shared buffer to 42
await pool.submit(async d => (new Int32Array(d)[0] = 42), buffer);

// read the data from the shared buffer
const result = pool.submit(async d => new Int32Array(d)[0], buffer);

console.log(await result); // prints 42
```
