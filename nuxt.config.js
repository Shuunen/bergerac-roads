const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Vins de Bergerac Duras',
    htmlAttrs: {
      lang: 'fr-FR',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#ffffff' },
      {
        hid: 'description',
        name: 'description',
        content: 'Tourisme vitivinicole dans le Bergerac',
      },
    ],
    script: [{ src: '/scripts/rollbar.js' }],
    noscript: [{ innerHTML: 'Ce site nécessite JavaScript.' }],
  },
  css: [
    '~assets/styles/shared/global.scss',
    'element-ui/lib/theme-chalk/index.css',
  ],
  env: {
    api: 'http://localhost:3003',
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  router: {
    middleware: 'i18n',
  },
  plugins: ['plugins/element-ui', 'plugins/i18n.js', 'plugins/lazyload'],

  modules: [
    [
      'nuxt-sass-resources-loader',
      {
        resources: ['./assets/styles/ressources/variables.scss'],
      },
    ],
    '@nuxtjs/pwa',
  ],
  build: {
    vendor: ['element-ui', 'speakingurl'],
    /*
    ** Run ESLint on save
    */
    extend(config, ctx) {
      // Exécuter ESLint lors de la sauvegarde
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }

      // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
      // for more information about purgecss.
      config.plugins.push(
        new PurgecssPlugin({
          paths: glob.sync([
            path.join(__dirname, './pages/**/*.vue'),
            path.join(__dirname, './layouts/**/*.vue'),
            path.join(__dirname, './components/**/*.vue'),
          ]),
          whitelist: ['html', 'body'],
        })
      )
    },
  },
}
