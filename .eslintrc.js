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
    "comma-dangle": ["off"],
    "spaced-comment": ["off"],
    "no-console": ["off"],
    "no-unused-vars": ["warn"],
    "space-unary-ops": ["off"],
    "import/newline-after-import": ["off"],
    "arrow-body-style": ["off", "as-needed"],
    "import/prefer-default-export": ["off"],

    "react/jsx-filename-extension": ["off"],
    "react/destructuring-assignment": ["off"],
    "react/no-did-update-set-state": ["off"],
    "react/jsx-props-no-spreading": ["off"],
    "react/jsx-indent-props": ["off"],
    "react/jsx-indent": ["error", "tab"],
    "react/no-array-index-key": ["warn"],
    "react/forbid-prop-types": ["warn"],
    "react/jsx-one-expression-per-line": ["off"],
    
  },
};
