const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ['@joggr/eslint-config'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    // @todo re-enable these rules and fix the underlying issues
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/no-confusing-void-expression': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/unbound-method': 'warn',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/return-await': 'warn',
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    'public',
    'next.config.mjs',
    'contentlayer.config.ts',
    'eslint.config.js',
    'tailwind.config.js',
    'postcss.config.js',
  ],
};

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
});
module.exports = [
  ...compat.config(config),
  {
    files: ['src/**/*.tsx'],
    rules: {
      'filenames-simple/naming-convention': ['error', { rule: 'PascalCase' }],
    },
  },
  {
    ignores: ['src/@generated/*', 'cli/*'],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: '@generated/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@launchpad/*',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@launchpad/lib/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@launchpad/+(plugins|hooks|routes)/**',
              group: 'internal',
              position: 'before',
            },
          ],
        },
      ],
    },
  },
];
