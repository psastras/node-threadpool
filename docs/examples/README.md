# Examples

## Basic Usage

To submit work to a thread pool, create a method which returns a promise.

In this example, the method is declared inline and returns a `Promise<string>`.

After completion of work, the thread pool resolves the promise with the value.

We use `await` to wait until the result is available then print it to `console.log`.

```typescript
const pool = Executors.newFixedThreadPool(4);
const result = pool.submit(async () => "hello world");
console.log(await result); // prints "hello world"
```

## Passing Data

Thread pool functions cannot access data outside of the function's context. This is because the worker runs in a separate thread and cannot access data in the main thread.

The easiest way to get data into the worker thread is to copy it. This can be done by providing `submit` two arguments (the first is the runnable function, the second is the data to copy).

Most standard data is supported. Class instances and data with circular references notably are not supported.

Note that each worker receives a _copy_ of the data -- changes made within each thread do not affect the original data.

In the following example, a Map is copied into the worker thread for data access.

```typescript
const pool = Executors.newSingleThreadedExecutor();
const map = new Map();
map.set("key", "value");
const data = {
  map
};
const result = pool.submit(async d => d.map.get("key"), data);
console.log(await result); // prints "value"
```

## Shared Array Buffers

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

## Atomics

For threads to access and write to the same elements in `SharedArrayBuffers`, Atomic operations are needed (ex. to implment locks and mutexes). In this example, the same area of memory is accessed in the main thread and the worker thread.

The worker thread waits until the memory has been changed (by the main thread's `Atomics.store`), then continues with its operation.

```javascript
const buffer = new SharedArrayBuffer(1 * Int32Array.BYTES_PER_ELEMENT);
const array = new Int32Array(buffer);
const pool = Executors.newSingleThreadedExecutor();

const result = pool.submit(async d => {
  const view = new Int32Array(d);
  Atomics.wait(view, 0, 0); // wait here until the value is no longer 0
  return Atomics.load(view, 0);
}, buffer);

Atomics.store(array, 0, 1); // change the value from 0, unblocking the worker thread

console.log(await result); // prints 1
```
