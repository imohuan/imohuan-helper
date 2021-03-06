import { builtinModules } from "module";
import { resolve } from "path";
import { defineConfig, UserConfigExport } from "vite";
import Dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  const option: UserConfigExport = {
    clearScreen: true,
    optimizeDeps: {
      extensions: [".ts", ".js"]
    },
    build: {
      outDir: resolve(__dirname, "./dist"),
      assetsDir: "",
      sourcemap: true,
      lib: {
        entry: resolve(__dirname, "./src/index.ts"),
        formats: ["cjs", "es"],
        fileName: (format) => `lib-${format}.js`
      },
      rollupOptions: {
        external: builtinModules.concat(["chalk", "winston", "winston-daily-rotate-file"])
        // output.globals[name] 为external排除包的全局名称
        // output: { globals: { chalk: "Chalk" } },
      }
    },
    plugins: []
  };

  if (mode === "production") {
    /** https://github.com/qmhc/vite-plugin-dts/blob/HEAD/README.zh-CN.md */
    option.plugins!.push(
      Dts({
        outputDir: resolve(__dirname, "dist/types"),
        skipDiagnostics: false,
        logDiagnostics: true
      })
    );
  }

  return option;
});
