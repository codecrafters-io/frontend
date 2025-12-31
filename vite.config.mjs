import { createRequire } from 'node:module';
import fs from 'node:fs';
import { defineConfig } from 'vite';
import { classicEmberSupport, extensions, optimizeDeps as embroiderOptimizeDeps } from '@embroider/vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { visualizer } from 'rollup-plugin-visualizer';

function versionFilePlugin(version) {
  return {
    name: 'codecrafters-version-file',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.txt',
        source: version,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // The Vite adapter runs `ember build -o tmp/compat-prebuild` internally.
  // Creating the directory up-front avoids Vite complaining that the root is missing.
  fs.mkdirSync('tmp/compat-prebuild', { recursive: true });

  const require = createRequire(import.meta.url);
  const emberEnv = mode === 'production' ? 'production' : mode === 'test' ? 'test' : 'development';
  const appConfig = require('./config/environment')(emberEnv);

  const shouldSpawnBundleAnalyzer = process.env.ANALYZE_BUNDLE === 'true';
  const shouldUploadSentrySourcemaps = !!process.env.CI && !process.env.VERCEL;

  return {
    // All actual build inputs (index.html, vendor.js, etc) come from the compat prebuild output.
    root: 'tmp/compat-prebuild',
    publicDir: false,

    base: '/',

    // Ensure Vite can resolve Ember's extra extensions when they appear.
    resolve: {
      extensions,
    },

    // Needed so Vite doesn't try to prebundle @embroider/macros and so it can
    // resolve Ember virtual modules during dep optimization.
    optimizeDeps: embroiderOptimizeDeps(),

    // Avoid Vite's default esbuild transform of TS (decorators); the prebuild output
    // should already be in the shape we want.
    esbuild: false,

    server: {
      port: 4200,
    },

    // Mirror our historical webpack behavior: treat `.lottie.json` imports as URLs.
    assetsInclude: ['**/*.glb', '**/*.lottie.json'],

    plugins: [
      ...classicEmberSupport(),
      versionFilePlugin(appConfig.x.version),

      shouldUploadSentrySourcemaps && process.env.SENTRY_AUTH_TOKEN
        ? sentryVitePlugin({
            org: 'codecrafters',
            project: 'frontend',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            release: {
              name: appConfig.x.version,
            },
          })
        : null,

      shouldSpawnBundleAnalyzer
        ? visualizer({
            filename: 'bundle-report.html',
            template: 'treemap',
            gzipSize: true,
            brotliSize: true,
          })
        : null,
    ].filter(Boolean),

    build: {
      sourcemap: true,
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[hash][extname]',
        },
      },
    },
  };
});
