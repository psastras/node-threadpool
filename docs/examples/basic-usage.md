# Basic Usage

To submit work to a thread pool, create a method which returns a promise.

In this example, the method is declared inline and returns a `Promise<string>`.

After completion of work, the thread pool resolves the promise with the value.

We use `await` to wait until the result is available then print it to `console.log`.

```typescript
const pool = Executors.newFixedThreadPool(4);
const result = pool.submit(async () => "hello world");
console.log(await result); // prints "hello world"
```
