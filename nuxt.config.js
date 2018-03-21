const path = require('path')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'bergerac-roads',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Cabin|Open+Sans' }
    ]
  },
  css: [
    '~assets/styles/shared/global.scss'
  ],
  env: {
    api: 'http://localhost:3003'
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */

  router: {
      middleware: 'i18n'
  },
  plugins: ['plugins/element-ui', 'plugins/i18n.js'],

  modules: [
    ['nuxt-sass-resources-loader', {
      resources: ['./assets/styles/ressources/variables.scss']
    }],
  ],
  build: {
    vendor: ['element-ui'],
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
