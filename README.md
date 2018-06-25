# node-threadpool

**WARNING: This is mostly experimental and the API is subject to change.**

This package implements thread pools for node 10.5's new worker thread API (see: https://nodejs.org/api/worker_threads.html).

## Usage

https://psastras.github.io/node-threadpool/modules/executors.html

If you're familiar with Java's thread pool API, this should be very familiar:

```javascript
import { Executors } from "node-threadpool";

const pool = Executors.newFixedThreadPool(1);
const result = pool.submit(async () => "hello world");

console.log(await result); // prints "hello world"
```

```typescript
import { Executors } from "node-threadpool";

const pool = Executors.newFixedThreadPool(1);
const result = pool.submit(async (): Promise<string> => "hello world");

console.log(await result); // prints "hello world"
```

**Requires node 10.5+. You must run node with the `--experimental-worker` flag enabled.**

```
NODE_OPTIONS=--experimental-worker ./server.js
```

or

```
node --experimental-worker ./server.js
```

### Detailed Usage Instructions

To install:

```sh
yarn add node-threadpool
```

or

```sh
npm install node-threadpool
```

Import `node-threadpool`:

```javascript
import { Executors } from "node-threadpool";
```

[Executors](https://psastras.github.io/node-threadpool/modules/executors.html) contains methods to create different thread pools.

Create a thread pool by calling one of these methods:

```javascript
// creates a thread pool with 4 threads
const pool = Executors.newFixedThreadPool(4);
```

Then submit work to the pool with the `submit` method. This method takes in a function with no arguments that returns a Promise. The `submit` method itself returns a Promise which is resolved when the function has been executed.

```javascript
// these execute in parallel (as long as the pool size >= 2)
const result1 = pool.submit(async () => "done 1");
const result2 = pool.submit(async () => "done 2");

console.log(await result1); // joins and prints "done1"
console.log(await result2); // joins and prints "done2"
```

See the [documentation](https://psastras.github.io/node-threadpool/) for full API details.

## TODOs

- Figure out better function / data serialization.
- Support cached thread executor
- Clean up code
- Settle on an API (when node's api is stable)

## License

MIT Licensed, see the LICENSE file.
