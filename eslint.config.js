const { FlatCompat } = ("@eslint/eslintrc");

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ['@joggr/eslint-config/react'],
};

const compat = new FlatCompat();
module.exports = [
  ...compat.config(config)
];