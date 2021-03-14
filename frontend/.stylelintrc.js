module.exports = {
  extends: [
    'stylelint-config-recommended-scss',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-declaration-block-no-ignored-properties'],
  rules: {
    'plugin/declaration-block-no-ignored-properties': true,
    'selector-pseudo-element-colon-notation': 'double',
    'font-family-no-missing-generic-family-keyword': true,
  },
  ignoreFiles: ['**/node_modules/**'],
}
