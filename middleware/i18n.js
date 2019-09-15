export default function ({ isHMR, app, store, route, params, error, redirect }) {
  if (isHMR) {
    return 'middleware called from hot module replacement, ignoring...'
  }
  const defaultLocale = app.i18n.fallbackLocale
  const locale = params.lang || defaultLocale // locale from params
  if (!store.state.locales.includes(locale)) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }
  store.commit('SET_LANG', locale) // set locale
  app.i18n.locale = store.state.locale
  const defaultLocaleParam = `/${defaultLocale}/`
  if (route.fullPath.includes(defaultLocaleParam)) {
    return redirect(route.fullPath.replace(defaultLocaleParam, '/'))
  }
  return 'nothing to do here'
}
