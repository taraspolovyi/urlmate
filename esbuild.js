(async () => {
  const esbuild = require("esbuild");

  console.log("Starting library build...");

  const result = await esbuild.build({
    entryPoints: ["src/index.ts", "src/light.ts"],
    outdir: "lib",
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: false,
    format: "esm",
    target: ["esnext"],
    metafile: true,
  });

  console.log("Library build complete.");

  console.log("Starting bundle analysis...");

  let text = await esbuild.analyzeMetafile(result.metafile, { color: true, verbose: true });

  console.log("Bundle analysis complete.");

  console.log(text);
})();
