---
home: true
actionText: Get Started →
actionLink: /installation
features:
- title: Minimal Dependencies
  details: Uses node's new worker thread API with lightweight wrappers to minimize package size.
- title: Simple API
  details: Supports async/await. Submit a function to a thread pool to run it and wait for the returned Promise to resolve.
- title: Shared Memory
  details: Worker threads can share memory via shared array buffers and synchronize with the Atomic API
footer: MIT Licensed | Copyright © 2018-present Paul Sastrasinh
---

---

### Quick Start

#### Install

With npm,

```bash
npm i node-threadpool # OR yarn add node-threadpool
```

#### Usage

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

::: warning COMPATIBILITY NOTE
Requires node 10.5+. You must run node with the `--experimental-worker` flag enabled.
:::

#### Enable Experimental Workers

```
NODE_OPTIONS=--experimental-worker ./server.js
```

or

```
node --experimental-worker ./server.js
```
