process.env.VUE_APP_WEBTRIT_APP_VERSION = require('./package.json').version

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',

  pages: {
    index: {
      entry: 'src/main.js',
      title: `${process.env.VUE_APP_WEBTRIT_APP_NAME} ${process.env.VUE_APP_WEBTRIT_APP_SUBNAME}`,
    },
  },

  transpileDependencies: [
    'vuetify',
  ],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },

  chainWebpack: (config) => {
    config.module
      .rule('media')
      .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => {
        options.limit = false
        return options
      })
  },
}
