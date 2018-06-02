import Vue from 'vue'

export const state = () => ({
  locales: ['en', 'fr'],
  locale: 'fr',
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    } else {
      console.error('cannot use non-hanled locale', locale)
    }
  },
}

export const eventBus = new Vue()
