# Usage

Once installed, import the `node-threadpool` package. The package contains a single export, `Executors`.

```javascript
import { Executors } from "node-threadpool";
```

`Executors` contains several methods to instantiate new thread pools. For a full list of methods, see the [Executor API documentation](https://psastras.github.io/node-threadpool/api/modules/executors.html).

To create a new thread pool, call one of the methods:

```javasript
const pool = Executors.newFixedThreadPool(4); // creates a pool with 4 threads
```

The pool is ready to use and functions can be executed in a worker thread by calling `submit(...)`. For example,

```javascript
import { Executors } from "node-threadpool";

// creates a thread pool with 4 threads
const pool = Executors.newFixedThreadPool(4);

// these execute in parallel (as long as the pool size >= 2)
const result1 = pool.submit(async () => "done 1");
const result2 = pool.submit(async () => "done 2");

console.log(await result1); // joins and prints "done1"
console.log(await result2); // joins and prints "done2"
```

`submit` takes in a function which returns a promise. When the function has been run the promise is resolved and the result is returned.

**Important: functions submitted to the thread pool cannot access data outside of the function's context. This includes imported modules which should be imported _inside_ the function.**

See the [examples section](#examples/README.md) for more examples on how to use the thread pool.
