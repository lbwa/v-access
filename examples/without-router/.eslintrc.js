module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
  rules: {},
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
