# node-threadpool

[![CircleCI](https://circleci.com/gh/psastras/node-threadpool.svg?style=svg)](https://circleci.com/gh/psastras/node-threadpool)
[![npm version](https://badge.fury.io/js/node-threadpool.svg)](https://badge.fury.io/js/node-threadpool)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

**WARNING: This project is mostly experimental and the API is subject to change.**

This package implements thread pools using node 10.5's new worker thread API (see: https://nodejs.org/api/worker_threads.html).

## Features

- Lightweight: one dependency (`surrial`)
- Simple API: submit a function, await a result (no need to mess with loading from files, strings, etc.)
- Supports transpiled code (ex: you may use Typescript to define your workers)
- Typesafe (if you're using Typescript, you can write workers with type inference)
- Can send most types of data including maps, sets, etc.
- Supports shared data between threads

## Why

Worker threads are usually expensive to create, a thread pool maintains the threads and allows you to submit work on the fly, without having to pay the cost of recreating threads.

With node's new `worker_thread` API, threads in the pool can pass messages to each other and read and write to shared memory.

## Usage

Full API documentation can be found here: https://psastras.github.io/node-threadpool/modules/executors.html.

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

Note: if you're not using async / await, Promise based functions work just as well.

### Warning

You may only access data within the runnable functions context. For example, this is an error:

```javascript
const hello = "hello";
await pool.submit(async () => hello);
```

Instead, use the optional `data` object when submitting the function:

```javascript
const hello = "hello";
await pool.submit(async (data) => data.hello, hello);
```

Similarly you must require third party modules from _inside_ the run method:

```javascript
const hello = "hello";
await pool.submit(async () => {
  const fs = require('fs');
  fs.readFileSync('README');
});
```

## Examples

### Basic Usage

```typescript
const pool = Executors.newFixedThreadPool(4);
const result = pool.submit(async () => "hello world");
console.log(await result); // prints "hello world"
```

### Pass Data

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

### Shared Data

```typescript
const buffer = new SharedArrayBuffer(1 * Int32Array.BYTES_PER_ELEMENT);
const array = new Int32Array(sharedBuffer);

// theres no lock, so in order to write safely we'll use one thread for this toy example
const pool = Executors.newSingleThreadedExecutor();

// set the data in the shared buffer to 42
await pool.submit(async d => (new Int32Array(d)[0] = 42), buffer);

// read the data from the shared buffer
const result = pool.submit(async d => new Int32Array(d)[0], buffer);

console.log(await result); // prints 42
```

## TODOs

- Figure out better function / data serialization.
- Support cached thread executor
- Clean up code
- Settle on an API (when node's api is stable)
- Support nested shared buffer serialization

## License

MIT Licensed, see the LICENSE file.
