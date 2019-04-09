import pkg from './package'

export default {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.config.title,
    htmlAttrs: {
      lang: 'fr-FR',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'theme-color', content: '#ffffff' },
    ],
    script: [
      { src: '/scripts/rollbar.js', defer: true },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    noscript: [{ innerHTML: 'Ce site nécessite JavaScript.' }],
  },
  env: {
    api: 'http://localhost:3003',
    cdn: 'https://atg502nfn.cloudimg.io/cdn/none/none/bergerac.lebowsky-dev.xyz',
    cdnBase: 'https://atg502nfn.cloudimg.io/cdn/none/none/',
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/styles/shared/global.scss',
    'element-ui/lib/theme-chalk/display.css',
    'element-ui/lib/theme-chalk/index.css',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/db',
    '@/plugins/i18n',
    '@/plugins/lazyload',
    '@/plugins/google-maps',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
  ],

  /*
  ** Build configuration
  */
  router: {
    middleware: 'i18n',
  },
  build: {
    transpile: [/^element-ui/],

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
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
