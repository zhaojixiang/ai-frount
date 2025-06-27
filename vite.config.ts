import url from '@rollup/plugin-url';
import legacy from '@vitejs/plugin-legacy';
// import dotenv from 'dotenv';
import fs from 'fs';
import istanbul from 'jojo-plugin-istanbul-vite';
import path from 'path';
import pxtovw from 'postcss-px-to-viewport';
import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';

/**
 * 开发环境 环境变量取envs中的配置
 * @param mode
 * @returns
 */
const developmentEnvs = (mode: ConfigEnv['mode']) => {
  const envDir = path.resolve(__dirname, 'envs');
  loadEnv(mode, envDir);
  return {
    envDir
  };
};

// https://vite.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  let config: UserConfig = {
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
        lintOnStart: true, // 启动时检查（新增选项）
        include: 'src/**/*.{js,jsx,ts,tsx}',
        exclude: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
        emitWarning: true, // 开发模式推荐
        emitError: command === 'build' // 构建时严格报错
      }),
      legacy({
        targets: [
          'Android >= 39',
          'Chrome >= 50',
          'Safari >= 10.1',
          'iOS >= 10.3',
          '> 1%',
          'ie >= 11'
        ],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      istanbul({ exclude: [] })
      // htmlPlugin()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src') // 将 @ 映射到 src 目录
      }
    },
    css: {
      postcss: {
        plugins: [
          pxtovw({
            unitToConvert: 'px', // 要转换的单位
            viewportWidth: 375, // 设计稿的视口宽度，一般是375(iPhone6)或750
            unitPrecision: 5, // 转换后的精度，即小数点位数
            propList: ['*'], // 能转化为vw的属性列表
            viewportUnit: 'vw', // 希望使用的视口单位
            fontViewportUnit: 'vw', // 字体使用的视口单位
            selectorBlackList: [], // 需要忽略的CSS选择器
            minPixelValue: 1, // 最小的转换数值
            mediaQuery: false, // 是否转换媒体查询中的px
            replace: true, // 是否直接替换属性值
            exclude: [/node_modules/], // 忽略某些文件夹下的文件
            // include: undefined, // 如果设置了include，那将只有匹配到的文件才会被转换
            landscape: false, // 是否添加根据landscapeWidth生成的媒体查询条件
            landscapeUnit: 'vw', // 横屏时使用的单位
            landscapeWidth: 1334 // 横屏时使用的视口宽度
          })
        ]
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },

    build: {
      sourcemap:
        process.env?.ENV_NAME === 'fat' ||
        process.env?.ENV_NAME === 'dev' ||
        process.env?.ENV_NAME === 'uat',
      target: 'es2015',
      minify: 'terser',
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 0,
      rollupOptions: {
        context: 'window',
        plugins: [
          url({
            include: ['**/*.svga']
          })
        ],
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'antd-mobile'],
            sentry: ['@woulsl/sentry-config']
          }
        }
      }
    }
  };

  // 本地开发生效
  if (command === 'serve') {
    // 获取本地环境变量
    const { envDir } = developmentEnvs(mode);
    config = {
      ...config,
      envDir,
      esbuild: {
        target: 'esnext'
      },
      server: {
        fs: {
          strict: true
        },
        open: false,
        host: '0.0.0.0',
        // proxy: proxy(ENV_NAME),
        port: 3001
      }
    };
  }
  // 打印工作目录下的第一级的所有文件和文件夹
  const files = fs.readdirSync(process.cwd());
  console.log(1111111, files);
  if (files.includes('.env')) {
    // 读取env文件
    const env1 = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
    console.log('22222222：', env1);
  }

  const { CDN_DOMAIN = '', CDN_PREFIX = '' } = process.env || {};

  // 构建之后生效
  if (command === 'build') {
    Object.keys(process.env).forEach((item) => {
      // 注入外部变量
      const whiteKeys = ['ENV_NAME', 'ENV_BASE'];
      if (whiteKeys.includes(item)) {
        process.env[`VITE_${item}`] = process.env[item];
      }
    });
    config = {
      ...config,
      // base: env.ALL_CDN_DOMAIN_AND_PREFIX_MD5_HASH,
      base: CDN_DOMAIN + CDN_PREFIX,
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    };
  }

  return config;
});
