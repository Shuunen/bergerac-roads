module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  globals: {
    // Cypress : start
    Cypress: false,
    beforeEach: false,
    context: false,
    cy: false,
    describe: false,
    expect: false,
    it: false,
    // Cypress : end
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'eslint:recommended',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // préférer utiliser `plugin:vue/strongly-recommended` ou `plugin:vue/recommended` pour des règles stictes.
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    semi: [2, 'never'],
    quotes: 'off',
    'no-console': 'off',
    'vue/attributes-order': 'off',
    'vue/max-attributes-per-line': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        bracketSpacing: true,
        trailingComma: 'es5',
        printWidth: 300
      },
    ],
  },
}
