# Passing Data

Thread pool functions cannot access data outside of the function's context. This is because the worker runs in a separate thread and cannot access data in the main thread.

The easiest way to get data into the worker thread is to copy it. This can be done by providing `submit` two arguments (the first is the runnable function, the second is the data to copy).

Most standard data is supported. Class instances and data with circular references notably are not supported.

Note that each worker receives a _copy_ of the data -- changes made within each thread do not affect the original data.

In the following example, a Map is copied into the worker thread for data access.

```javascript
const pool = Executors.newSingleThreadedExecutor();
const map = new Map();
map.set("key", "value");
const data = {
  map
};
const result = pool.submit(async d => d.map.get("key"), data);
console.log(await result); // prints "value"
```
