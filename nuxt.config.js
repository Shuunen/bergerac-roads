// const path = require('path')

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
  plugins: ['plugins/element-ui', 'plugins/lazyload'],
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
    },
  },
}
