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
      t.is("rekt", e.message);
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
  const result = pool.submit(
    async (d): Promise<number> => d.answerToLife,
    data
  );

  t.is(await result, 42);
});
