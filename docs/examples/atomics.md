# Atomics

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
