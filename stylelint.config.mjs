/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  cache: true,
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'config',
          /** tailwindcss v1, v2 */
          'variants',
          'responsive',
          'screen',
          'zrly',
        ],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme'],
      },
    ],
  },
};
