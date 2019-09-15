module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-console': 'off',
    'vue/html-self-closing': 'off',
    'vue/attributes-order': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'comma-dangle': ['error', 'always-multiline'],
  }
}
