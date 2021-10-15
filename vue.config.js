const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const port = 8111
const name = process.env.VUE_APP_TITLE

module.exports = {
  publicPath: process.env.BASE_URL,
  lintOnSave: true,
  productionSourceMap: process.env.NODE_ENV !== 'production',

  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: {
      // vue: 'Vue'
    }
  },

  chainWebpack: (config) => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    // 修复HMR
    config.resolve.symlinks(true)
  },

  devServer: {
    port: port,
    proxy: {
      // '/api/webService': {
      //   target: 'http://192.168.3.97:8808',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api/webService': ''
      //   }
      // },
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://127.0.0.1:3000/service',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
}
