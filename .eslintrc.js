module.exports = {
  extends: ['airbnb-typescript/base'],
  overrides: [
    {
      "files": ["*"],
      "rules": {
        "import/prefer-default-export": "off",
      }
    }
  ]
};