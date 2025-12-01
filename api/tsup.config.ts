import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'build',
  format: ['cjs'],
  target: 'node24',
  sourcemap: true,
  splitting: false,
  clean: true,
  bundle: true,
  external: [
    '@prisma/client',
    '@prisma/client-runtime-utils',
    '.prisma/client',
  ],
});
