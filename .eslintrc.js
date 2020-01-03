module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    quotes: ["warn", "double"],
    "no-tabs": ["off"],
    "object-curly-newline": ["off"],
    "template-tag-spacing": ["error", "always"],
    "arrow-parens": ["error", "as-needed"],
    "indent": ["error", "tab"],
    "operator-linebreak": ["off"],
    "no-trailing-spaces": ["warn", {
      "skipBlankLines": true,
      "ignoreComments": true,
    }],
    "no-unused-vars": ["warn"],
    "comma-dangle": ["off"],
    "spaced-comment": ["off"],
    "no-console": ["off"],
    "space-unary-ops": ["off"],
    "import/newline-after-import": ["off"],
    "arrow-body-style": ["off"],
    "import/prefer-default-export": ["off"],
    "no-return-assign": ["error", "except-parens"],

    "react/jsx-indent": ["error", "tab"],
    "react/require-default-props": ["warn"],
    "react/no-array-index-key": ["warn"],
    "react/forbid-prop-types": ["warn"],
    "react/jsx-filename-extension": ["off"],
    "react/destructuring-assignment": ["off"],
    "react/no-did-update-set-state": ["off"],
    "react/jsx-props-no-spreading": ["off"],
    "react/jsx-indent-props": ["off"],
    "react/jsx-one-expression-per-line": ["off"],
    "react/jsx-first-prop-new-line": ["off"],
    "react/jsx-max-props-per-line": ["off"],
    
  },
};