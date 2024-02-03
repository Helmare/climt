import { defineConfig } from 'tsup';
export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['./src/index.ts'],
  outDir: './lib',
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
});