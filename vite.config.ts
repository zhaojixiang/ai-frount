import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig(({ command }: ConfigEnv): UserConfig => {
  let config: UserConfig = {
    envPrefix: ['VITE_', 'ENV_'],
    clearScreen: false,
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.svga': 'dataurl'
        }
      }
    },
    assetsInclude: ['**/*.svga'],
    plugins: [
      eslint({
        fix: true,
        lintOnStart: true,
        include: 'src/**/*.{js,jsx,ts,tsx}',
        exclude: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
        emitWarning: true,
        emitError: command === 'build'
      }),
      legacy({
        targets: [
          'Chrome >= 64',
          'Edge >= 79',
          'Firefox >= 67',
          'Safari >= 12',
          '> 1%',
          'not dead'
        ],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    css: {
      // 移除 postcss-px-to-viewport 插件，PC端不需要px转vw
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    build: {
      sourcemap: process.env?.ENV_NAME === 'test',
      target: 'es2015',
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000, // PC端可以适当提高chunk大小限制
      assetsInlineLimit: 4096, // 4kb以下文件转base64
      rollupOptions: {
        context: 'window',
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            antdMobile: ['antd'],
            vendor: ['lodash-es', 'dayjs', 'axios']
          }
        }
      }
    }
  };

  // 本地开发生效
  if (command === 'serve') {
    config = {
      ...config,
      esbuild: {
        target: 'esnext'
      },
      server: {
        fs: {
          strict: true
        },
        open: true, // PC端开发自动打开浏览器
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: `http://jjtools.store`,
            changeOrigin: true
          }
        },
        port: 3000 // PC端使用默认3000端口
      }
    };
  }

  // 构建之后生效
  if (command === 'build') {
    Object.keys(process.env).forEach((item) => {
      const whiteKeys = ['ENV_NAME'];
      if (whiteKeys.includes(item)) {
        process.env[`VITE_${item}`] = process.env[item];
      }
    });
    config = {
      ...config,
      base: '/',
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    };
  }

  return config;
});
