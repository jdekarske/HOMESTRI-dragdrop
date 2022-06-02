module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb',
    'airbnb-typescript/base',
  ],
  ignorePatterns: ["webpack*", "dist/"],
  parserOptions: {
    project: "./tsconfig.json",
  },
};