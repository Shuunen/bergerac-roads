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
    script: [
      { src: '/scripts/polyfills.js', defer: false },
      { src: '/scripts/rollbar.js', defer: true },
    ],
    noscript: [{ innerHTML: 'Ce site nécessite JavaScript.' }],
  },
  css: [
    '~assets/styles/shared/global.scss',
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/theme-chalk/display.css',
    'vue-multiselect/dist/vue-multiselect.min.css',
  ],
  env: {
    api: 'http://localhost:3003',
    cdn: 'http://bergerac.lebowsky-dev.xyz'
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
  plugins: [
    'plugins/element-ui',
    'plugins/db',
    'plugins/i18n',
    'plugins/lazyload',
    'plugins/google-maps',
  ],
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
    vendor: ['element-ui'],
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
      if (!ctx.isClient) {
        // This instructs Webpack to include `vue2-google-maps`'s Vue files
        // for server-side rendering
        config.externals.splice(0, 0, function(context, request, callback) {
          if (/^vue2-google-maps($|\/)/.test(request)) {
            callback(null, false)
          } else {
            callback()
          }
        })
      }
    },
  },
}
