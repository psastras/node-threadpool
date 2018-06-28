# Sharing Data

`node-threadpool` and `worker_thread`s support sharing data between threads. Unlike copying data, sharing data allows threads to read and write each other's results (and also avoids the copy overhead).

Be aware that writing to the same piece of data can be dangerous if the data is written to at the same time. The [Atomics API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) can help with this.

Data can be shared with worker threads in the same way data can be copied to the worker threads. If the type of data is `SharedArrayBuffer` it will be shared instead of copied.

For example,

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

The examples section contains more examples, including an [example of using Atomics](#examples/atomics.md).
