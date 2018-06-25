import typescript from "rollup-plugin-typescript2";
import istanbul from "rollup-plugin-istanbul";
import nodeResolve from "rollup-plugin-node-resolve";
import resolve from "rollup-plugin-node-resolve";

const pkg = require("./package.json");
const external = Object.keys(pkg.dependencies);

const plugins = [
  nodeResolve(),
  typescript({
    typescript: require("typescript")
  }),
  resolve()
];

if (process.env.BUILD !== "production") {
  plugins.push(
    istanbul({
      exclude: ["test/**/*", "node_modules/**/*"]
    })
  );
}

external.push("worker_threads");

export default {
  input: "./lib/index.ts",

  plugins,
  external,

  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "node-threadpool",
      sourcemap: true,
      globals: ["worker_threads"]
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
      globals: ["worker_threads"]
    }
  ]
};
