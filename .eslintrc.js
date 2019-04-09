module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  globals: {
    $nuxt: false
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    semi: ["error", 'never'],
    quotes: ["error", "single"],
    "brace-style": "error",
    "yoda": "error",
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "block-spacing": "error",
    "no-irregular-whitespace": "error",
    "spaced-comment": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "space-before-function-paren": ["error", "never"],
    "space-before-blocks": ["error", "always"],
    'no-console': 'off',
    'vue/attributes-order': 'off',
    'vue/max-attributes-per-line': 'off',
  },
}
