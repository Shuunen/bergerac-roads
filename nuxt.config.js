const path = require('path')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Vins de Bergerac Duras',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#ffffff' },
      { hid: 'description', name: 'description', content: 'Tourisme vitivinicole dans le Bergerac' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', color: '#5bbad5', href: '/assets/safari-pinned-tab.svg' },
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
  plugins: ['plugins/element-ui'],
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
