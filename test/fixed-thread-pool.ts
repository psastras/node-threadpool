import test from "ava";
import { Executors } from "../lib";

test("resolves a basic string", async t => {
  const pool = Executors.newFixedThreadPool(2);
  const result1 = pool.submit(async () => "hello world 1");
  const result2 = pool.submit(async () => "hello world 2");

  t.is(await result2, "hello world 2");
  t.is(await result1, "hello world 1");
});

test("propagates errors", async t => {
  const result = await Executors.newFixedThreadPool(1)
    .submit(() => {
      throw new Error("rekt");
    })
    .catch(e => {
      t.deepEqual(new Error("rekt"), e);
    });
});

test("nested functions work", async t => {
  const pool = Executors.newSingleThreadedExecutor();
  const result = pool.submit(async () => {
    const meaningOfLife = () => {
      return 42;
    };
    return meaningOfLife();
  });

  t.is(await result, 42);
});

test("works with typescript", async t => {
  const pool = Executors.newSingleThreadedExecutor();
  const result = pool.submit(async (): Promise<number> => 42);

  t.is(await result, 42);
});

test("can pass data", async t => {
  const pool = Executors.newSingleThreadedExecutor();
  const data = {
    answerToLife: 42
  };
  const result = pool.submit(async d => d!.answerToLife, data);

  t.is(await result, 42);
});

test("can pass data with functions", async t => {
  const pool = Executors.newSingleThreadedExecutor();
  const data = {
    answerToLife: () => 42
  };
  const result = pool.submit(async d => d!.answerToLife(), data);

  t.is(await result, 42);
});

test("can pass data with maps", async t => {
  const pool = Executors.newSingleThreadedExecutor();
  const map = new Map();
  map.set("key", "value");
  const data = {
    map
  };
  const result = pool.submit(async d => d!.map.get("key"), data);
  t.is(await result, "value");
});

test("can pass shared data", async t => {
  const sharedBuffer = new SharedArrayBuffer(1 * Int32Array.BYTES_PER_ELEMENT);
  const array = new Int32Array(sharedBuffer);
  const pool = Executors.newSingleThreadedExecutor();
  const data = {
    sharedBuffer
  };
  // set the data in the first one to 3
  await pool.submit(async d => (new Int32Array(d!.sharedBuffer)[0] = 3), data);

  // read the data from the shared buffer
  const result = pool.submit(
    async d => new Int32Array(d!.sharedBuffer)[0],
    data
  );
  t.is(await result, 3);
});

test("can pass raw shared data", async t => {
  const sharedBuffer = new SharedArrayBuffer(1 * Int32Array.BYTES_PER_ELEMENT);
  const array = new Int32Array(sharedBuffer);
  const pool = Executors.newSingleThreadedExecutor();

  // set the data in the first one to 3
  await pool.submit(async d => (new Int32Array(d!)[0] = 3), sharedBuffer);

  // read the data from the shared buffer
  const result = pool.submit(async d => new Int32Array(d!)[0], sharedBuffer);
  t.is(await result, 3);
});

test("atomic lock", async t => {
  const buffer = new SharedArrayBuffer(1 * Int32Array.BYTES_PER_ELEMENT);
  const array = new Int32Array(buffer);
  const pool = Executors.newSingleThreadedExecutor();

  const result = pool.submit(async d => {
    const view = new Int32Array(d!);
    Atomics.wait(view, 0, 0); // wait here until the value is no longer 0
    return Atomics.load(view, 0);
  }, buffer);

  Atomics.store(array, 0, 1); // change the value from 0, unblocking the worker thread

  t.is(await result, 1);
});
