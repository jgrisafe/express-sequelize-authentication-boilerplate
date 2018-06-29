module.exports = {
  env: { "es6": true },
  parserOptions: {
    "ecmaVersion": 2017
  },
  rules: {
    "max-len": ["warn", { "code": 66, "comments": 66 }],
    "react/jsx-no-target-blank": 0
  }
}