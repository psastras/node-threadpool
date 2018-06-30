# Installation

## Requirements

**`node-threadpool` requires node >= 10.5 to use the [worker thread API](https://nodejs.org/api/worker_threads.html).**

Note that this is `node` only (ie. not available in the browser - use web workers instead).

When running code, the experimental workers feature must be enabled. This can be enabled by either:

Passing the `--experimental-workers` flag

```sh
node --experimental-worker <script>
```

Or by setting the environment variable

```bash
NODE_OPTIONS=--experimental-worker node <script>
```

## Downloading

Versions of `node-threadpool` are [published to npm](https://npmjs.com/package/node-threadpool).

If using `npm`, add the dependency via

```bash
npm i node-threadpool
```

Or if using `yarn`

```bash
yarn add node-threadpool
```
