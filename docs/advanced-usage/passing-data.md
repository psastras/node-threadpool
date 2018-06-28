# Passing Data

Worker threads can only access data within the thread's (or the submmited functions) context. In order to operate on data in the main thread, data must be copied from the main thread to each worker thread which needs to access it.

This can be done by passing in a second argument to `submit(...)`. The value in the second argument will be copied over to the worker thread and is passed into the submitted function.

Note that since this is a copy of the data, any writes to the data in the worker thread are not reflected in the main (original) thread's data. Instead return results from the runnable function.

Some examples:

## Copy a String

```javascript
const pool = Executors.newSingleThreadedExecutor();
// the string "string to copy" is passed to the worker thread and accessible via the data argument
const result = pool.submit(async data => data, "string to copy");
console.log(await result); // prints "string to copy"
```

## Copy an Object

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
