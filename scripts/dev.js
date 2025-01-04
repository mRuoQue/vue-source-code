import minimist from "minimist";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { createRequire } from "module";
import esbuild from "esbuild";

const argv = minimist(process.argv.slice(2));
const target = argv._[0] || "reactivity"; // 打包当前项目
const format = argv.f || "iife";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const pkg = require(`../packages/${target}/package.json`);
esbuild
  .context({
    entryPoints: [entry],
    bundle: true, // 依赖会打包到一起
    sourcemap: true,
    format: format,
    platform: "browser",
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    // external: ["vue"],
    globalName: pkg.buildOptions?.name,
  })
  .then((ctx) => {
    console.log("run dev success");

    return ctx.watch();
  });
