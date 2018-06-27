# node-threadpool

**WARNING: This project is mostly experimental and the API is subject to change.**

This package implements thread pools using node 10.5's new worker thread API (see: https://nodejs.org/api/worker_threads.html).

It supports an easy to use Promise based API to spawn and transfer data to and from threads.

Unlike `cluster` or other similar node threading libraries, worker threads are native threads and support message passing as well as shared memory and atomic operations.

[![CircleCI](https://circleci.com/gh/psastras/node-threadpool.svg?style=svg)](https://circleci.com/gh/psastras/node-threadpool)
[![npm version](https://badge.fury.io/js/node-threadpool.svg)](https://badge.fury.io/js/node-threadpool)
[![codecov](https://codecov.io/gh/psastras/node-threadpool/branch/master/graph/badge.svg)](https://codecov.io/gh/psastras/node-threadpool)
[![dependencies Status](https://david-dm.org/psastras/node-threadpool/status.svg)](https://david-dm.org/psastras/node-threadpool)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

---

## Quick Start

With npm,

```
npm i node-threadpool
```

Or with yarn,

```
yarn add node-threadpool
```

Then,

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
