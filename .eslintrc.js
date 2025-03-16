module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks', 'react-native', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  rules: {
    // General rules
    'no-unused-vars': 'off', // Fully disable unused variable warnings
    'no-console': 'off', // Allow console statements
    'no-dupe-keys': 'off', // Disable duplicate key rule
    'no-undef': 'off', // Fully disable undefined variable warnings
    'max-len': 'off', // Fully disable max line length warnings
    'require-jsdoc': 'off', // Fully disable JSDoc requirement warnings

    // React rules
    'react/prop-types': 'off', // Disable PropTypes validation
    'react/no-unescaped-entities': 'off', // Allow unescaped characters
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off', // Fully disable exhaustive dependency warnings

    // React Native rules
    'react-native/no-inline-styles': 'off', // Allow inline styles
    'react-native/no-unused-styles': 'off', // Disable unused styles rule
    'react-native/no-color-literals': 'off', // Disable color literal warnings
    'react-native/sort-styles': 'off', // Disable style sorting warnings
    'react-native/no-raw-text': 'off', // Fully disable raw text warnings

    // Prettier integration
    'prettier/prettier': 'off', // Fully disable Prettier-related warnings and errors

    // Additional customization
    'react/no-unknown-property': 'warn', // Warn for invalid DOM properties
    'react/jsx-key': 'warn', // Warn if `key` is missing in list rendering
    'react/jsx-no-duplicate-props': ['warn', { ignoreCase: true }], // Warn for duplicate props in JSX
    'react/jsx-curly-brace-presence': 'off', // Disable curly brace enforcement
    'no-shadow': 'off', // Allow variable shadowing
    'no-catch-shadow': 'off', // Allow shadowing in catch blocks
    'react/no-unused-state': 'warn', // Warns for unused state variables

    // Object and JSX rules
    'react/jsx-sort-props': 'off', // Disable JSX prop sorting
    'sort-keys': 'off', // Disable object key sorting
  },
};
