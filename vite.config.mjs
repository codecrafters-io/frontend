import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const shouldSpawnBundleAnalyzer = process.env.ANALYZE_BUNDLE === 'true';
const shouldUploadSentrySourcemaps = !!process.env.CI && !process.env.VERCEL;

// Get version from environment, similar to config/environment.js
const version = `44.0.${process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev'}`;

// Custom plugin to emit version.txt file
function versionFilePlugin() {
  return {
    name: 'version-file-plugin',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.txt',
        source: version,
      });
    },
  };
}

export default defineConfig(() => ({
  resolve: {
    alias: {
      'codecrafters-frontend': resolve(__dirname, 'app'),
    },
  },
  plugins: [
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      configFile: './babel.vite.config.cjs',
    }),

    // Version file plugin
    versionFilePlugin(),

    // Codecov bundle analysis
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'client',
      uploadToken: process.env.CODECOV_TOKEN,
    }),

    // Sentry sourcemaps upload (production CI builds only)
    shouldUploadSentrySourcemaps
      ? sentryVitePlugin({
          org: 'codecrafters',
          project: 'frontend',
          authToken: process.env.SENTRY_AUTH_TOKEN,
          release: {
            name: version,
          },
        })
      : null,

    // Bundle analyzer (when ANALYZE_BUNDLE=true)
    shouldSpawnBundleAnalyzer
      ? visualizer({
          open: true,
          gzipSize: true,
        })
      : null,
  ].filter(Boolean),

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        // Ensure assets get hashed names for cache busting
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  // CSS configuration - postcss.config.mjs will be auto-detected

  // Development server configuration
  server: {
    port: 4200,
    strictPort: true,
  },

  // Preview server configuration (for testing production builds locally)
  preview: {
    port: 4200,
    strictPort: true,
  },
}));
