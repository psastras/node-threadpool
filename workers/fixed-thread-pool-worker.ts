import { deserialize, serialize } from "surrial";
import { parentPort } from "worker_threads";

parentPort!.on("message", ({ value, port, runnable, data, rawData }) => {
  if (value === "__run__") {
    try {
      const hydratedData =
        data &&
        (data instanceof SharedArrayBuffer
          ? data
          : Object.assign(deserialize(data), rawData));
      deserialize(runnable)(hydratedData).then((result: any) => {
        port.postMessage({ value: "__result__", result: serialize(result) });
      });
    } catch (e) {
      port.postMessage({
        msg: e.message,
        result: serialize(e),
        value: "__error__"
      });
    }
  }
});
