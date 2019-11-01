const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
const keys = require('lodash.keys')

const envConfig = require('./src/config/env.config')

const isProduction = process.env.mode !== 'local'

const cdn = {
  css: [],
  js: [
    '//cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.2.5/polyfill.js',
    '//cdn.bootcss.com/vue/2.6.10/vue.runtime.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.bootcss.com/axios/0.18.0/axios.min.js',
    '//cdn.bootcss.com/moment.js/2.24.0/moment.min.js',
    '//cdn.bootcss.com/moment.js/2.24.0/locale/zh-cn.js'
  ]
}
const productionGzipExtensions = ['js', 'css', 'json', 'txt', 'html', 'ico', 'svg']

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: config => {
    if (isProduction) {
      // 用 cdn 方式引入
      config.externals = {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        axios: 'axios',
        moment: 'moment'
      }

      config.plugins.push(
        // 开启压缩
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        }),
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log'] // 移除console
            }
          },
          sourceMap: false,
          parallel: true
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
      )

      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积 整数类型（以字节为单位 500k）.
        maxEntrypointSize: 500 * 1024,
        // 生成文件的最大体积 整数类型（以字节为单位 300k）.
        maxAssetSize: 300 * 1024,
        // 只给出 js 文件的性能提示.
        assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }
    }
  },

  chainWebpack: config => {
    config.resolve.alias
      .set('@public', resolve('public'))
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@config', resolve('src/config'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
      .set('@utils', resolve('src/utils'))

    if (isProduction) {
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')

      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            minChunks: 1,
            test: /node_modules/,
            priority: 10,
            enforce: true,
            chunks: 'initial'
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5, // The default limit is too small to showcase the effect
            minSize: 0 // This is example is too small to create commons chunks
          }
        }
      })

      // 生产环境注入 cdn.
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })

      const svgRule = config.module.rule('svg')
      svgRule.uses.clear()
      svgRule
        .oneOf('inline')
        .resourceQuery(/inline/)
        .use('vue-svg-icon-loader')
        .loader('vue-svg-icon-loader')
        .end()
        .end()
        .oneOf('external')
        .use('file-loader')
        .loader('file-loader')
        .options({
          name: 'assets/[name].[hash:8].[ext]'
        })
    }

    config.plugin('define').tap(args => {
      keys(envConfig[process.env.mode]).forEach(key => {
        args[0]['process.env'][key] = JSON.stringify(envConfig[process.env.mode][key])
      })
      return args
    })
  },

  css: {
    // 是否使用 css 分离插件 ExtractTextPlugin.
    extract: false,
    // 是否开启 CSS source maps.
    sourceMap: false,
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      }
    },
    // 是否启用 CSS modules for all css / pre-processor files.
    modules: false
  },

  devServer: {
    port: 3000,
    proxy: {
      '/api2': {
        target: envConfig[process.env.mode].BASE_API_2, // 请求本地需要后台项目
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/api2': '' // 默认所有请求都加了 api 前缀, 需要去掉
        }
      },
      '/api': {
        target: envConfig[process.env.mode].BASE_API, // 请求本地需要后台项目
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/api': '' // 默认所有请求都加了 api 前缀, 需要去掉
        }
      }
    }
  },
  parallel: require('os').cpus().length > 1,
  // 如果你不需要生产环境的 source map, 可以将其设置为 false 以加速生产环境构建.
  productionSourceMap: false,
  lintOnSave: true,
  transpileDependencies: ['vue-plyr']
}
