const path = require('path');


module.exports = {
  "extends": [
    "airbnb-base",
    "plugin:import/recommended"
  ],
  "plugins": ["react", "import"],
  "env": {
    "browser": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "allowImportExportEverywhere": true,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "experimentalDecorators": true,
      "jsx": true
    }
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        config: path.join(__dirname, 'webpack.aliases.js')
      }
    }
  },
  "rules": {
    "semi": [2, "never"],
    "strict": [2, "global"],
    "import/first": [0],
    "global-require": [0],
    "no-param-reassign": [2, {"props": false}],
    "object-curly-spacing": [0],
    "no-unused-vars": [0],
    "import/extensions": [0],
    "function-paren-newline": [2, "consistent"],
    "react/no-unknown-property": [2, {"ignore": ["class"]}],
    "react/self-closing-comp": [2, {"component": true, "html": false}],
    "arrow-parens": [2, "always"],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "ignore"
    }],
    "class-methods-use-this": ["error", {
      "exceptMethods": [
        "render",
        "getInitialState",
        "getDefaultProps",
        "componentWillMount",
        "componentDidMount",
        "componentWillReceiveProps",
        "shouldComponentUpdate",
        "componentWillUpdate",
        "componentDidUpdate",
        "componentWillUnmount"
      ]
    }]
  }
};
