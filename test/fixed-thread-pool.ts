import test from "ava";
import { Executors } from "../lib";

test("resolves a basic string", async t => {
  const pool = Executors.newFixedThreadPool(2);
  const result1 = pool.submit(async (): Promise<string> => "hello world 1");
  const result2 = pool.submit(async (): Promise<string> => "hello world 2");

  t.is(await result2, "hello world 2");
  t.is(await result1, "hello world 1");
});

test("propagates errors", async t => {
  const result = await Executors.newFixedThreadPool(1)
    .submit(
      (): Promise<string> => {
        throw new Error("rekt");
      }
    )
    .catch(e => {
      t.is("rekt", e.message);
    });
});

test("nested functions work", async t => {
  const pool = Executors.newFixedThreadPool(1);
  const result = pool.submit(
    async (): Promise<number> => {
      const meaningOfLife = () => {
        return 42;
      };
      return meaningOfLife();
    }
  );

  t.is(await result, 42);
});
