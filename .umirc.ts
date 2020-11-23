import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: false,
  // publicPath: './',
  // base: '/',
  // hash: true,
  // history: {
  //   type: 'hash'
  // },
  dynamicImport: {
    loading: '@/Loading.tsx',
  },
  routes: [
    {
      exact: false, path: '/', component: '@/layouts/index', name: 'homepage', title: '首页',
      routes: [
        { exact: true, path: '/', redirect: '/main', title: '首页' },
        { exact: true, path: '/main', component: '@/pages/homepage', name: 'homepage', title: '首页' },
        { component: '@/pages/404' },
      ],
    }
  ],
  // proxy: {
  //   '/api': {
  //     // target: 'http://10.6.60.242:8040/uih-hap/board/production',
  //     target: 'http://10.6.204.81:8040/uih-hap/board/production',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api': '' },
  //   },
  // },
  // 添加 loader
  chainWebpack: function (config, { webpack }) {
    config.module
      .rule('mp4')
      .test(/.mp4$/)
      .use('file-loader')
      .loader('file-loader');

    config.module
      .rule('mov')
      .test(/.mov$/)
      .use('file-loader')
      .loader('file-loader');
  },
});
