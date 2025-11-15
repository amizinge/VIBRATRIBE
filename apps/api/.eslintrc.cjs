module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['standard-with-typescript'],
  parserOptions: {
    project: ['./tsconfig.json']
  },
  env: {
    node: true
  }
};
