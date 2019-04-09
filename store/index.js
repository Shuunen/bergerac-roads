export const state = () => ({
  locales: ['en', 'fr'],
  locale: 'fr',
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    } else {
      console.error('cannot use non-handled locale', locale)
    }
  },
}

export * from './bus.js'
