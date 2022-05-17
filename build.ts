import { build, emptyDir } from "https://deno.land/x/dnt@0.23.0/mod.ts";

await emptyDir("./.npm");
await emptyDir("./.npm/docs");
await emptyDir("./.npm/docs/assets");

await build({
  entryPoints: ["./package/mod.ts"],
  outDir: "./.npm",
  packageManager: "pnpm",
  shims: {
    undici: true
  },
  typeCheck: false,
  test: false,
  package: {
    name: "unsort",
    description:
      "An unreliable and overall unusable sorting library for numbers with a global cache on the edge.",
    keywords: ["sorting", "edge", "global-cache"],
    version: "1.0.0-rc3",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/jwanner83/unsort.git",
    },
    bugs: {
      url: "https://github.com/jwanner83/unsort/issues",
    },
  },
});

Deno.copyFileSync("./docs/assets/lead.svg", ".npm/docs/assets/lead.svg");
Deno.copyFileSync("LICENSE", ".npm/LICENSE");
Deno.copyFileSync("README.md", ".npm/README.md");
