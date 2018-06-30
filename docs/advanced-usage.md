# Advanced Usage

## Passing Data

Worker threads can only access data within the thread's (or the submmited functions) context. In order to operate on data in the main thread, data must be copied from the main thread to each worker thread which needs to access it.

This can be done by passing in a second argument to `submit(...)`. The value in the second argument will be copied over to the worker thread and is passed into the submitted function.

Note that since this is a copy of the data, any writes to the data in the worker thread are not reflected in the main (original) thread's data. Instead return results from the runnable function.

Some examples:

### Copy a String

```javascript
const pool = Executors.newSingleThreadedExecutor();
// the string "string to copy" is passed to the worker thread and accessible via the data argument
const result = pool.submit(async data => data, "string to copy");
console.log(await result); // prints "string to copy"
```

### Copy an Object

```javascript
const pool = Executors.newSingleThreadedExecutor();
const map = new Map();
map.set("key", "value");
const data = {
  map
};
// the object is passed to the worker thread and accessible via the data argument
const result = pool.submit(async data => data.map.get("key"), data);
console.log(await result); // prints "value"
```

Most plain javascript object types are supported when copying data. Some notable exceptions are circular references and class instances.

## Sharing Data

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
