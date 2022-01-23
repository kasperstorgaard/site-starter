module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['prettier', 'import'],
  // add your custom rules here
  rules: {
    semi: ['error', 'always'],
    'object-curly-spacing': ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    quotes: ['warn', 'single'],
  },
};