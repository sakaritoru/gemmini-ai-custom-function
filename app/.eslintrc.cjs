module.exports = {
  env: {
    commonjs: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  ignorePatterns: ['dist/'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'import',
    'sort-keys-fix',
    'typescript-sort-keys',
    'unused-imports',
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    'import/no-duplicates': 'error',
    'prettier/prettier': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
    'typescript-sort-keys/interface': 'error',
    'unused-imports/no-unused-imports': 'error',
  },
}
