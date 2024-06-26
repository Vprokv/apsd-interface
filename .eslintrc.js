const path = require('path')

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    requireConfigFile: false,
    ecmaVersion: 12,
    sourceType: 'module',
    babelOptions: {
      presets: ['@babel/preset-react', ['babel-preset-react-app', false]],
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended',
    'plugin:import/react',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: [
        ['@', path.resolve(__dirname, './src')],
        ['@Components', path.resolve(__dirname, './src/components_ocean')],
      ],
      node: {
        extensions: ['.js', '.jsx'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'spaced-comment': 'error',
    'no-duplicate-imports': 'error',
    'prettier/prettier': ['error', { singleQuote: true, endOfLine: 'auto' }],
    quotes: ['error', 'single', { avoidEscape: true }],
    'linebreak-style': 0,
    semi: ['error', 'never'],
    'no-trailing-spaces': 'error',
    'no-console': 'warn',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'warn',
    'react/require-default-props': 'off',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
  },
}
