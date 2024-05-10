import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import { FlatCompat } from '@eslint/eslintrc';

const config = {
  extends: ['standard-with-typescript'],
  rules: {
    /**
     * Support TypeScript + Semistandard (not native)
     *
     * @link https://github.com/standard/ts-standard/issues/115
     */
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/no-extra-semi': 'error',
  },
};

const compat = new FlatCompat({
  recommendedConfig: tseslint.configs.recommended,
});

export default [
  ...compat.config(config),
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReactConfig,
];
