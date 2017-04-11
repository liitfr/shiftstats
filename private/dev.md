 ### Install
`meteor create shiftstats --full`

### Linters
`meteor npm install --save-dev babel-eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-meteor eslint-plugin-react eslint-plugin-jsx-a11y eslint-import-resolver-meteor eslint stylelint`

```json
"eslintConfig": {
  "env": {
    "meteor": true,
    "mocha": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "allowImportExportEverywhere": true
  },
  "plugins": [
    "meteor"
  ],
  "extends": [
    "airbnb",
    "plugin:meteor/recommended"
  ],
  "settings": {
    "import/resolver": "meteor"
  },
  "rules": {
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": "off",
    "import/extensions": ["off", "never"],
    "import/no-unresolved": ["error", { "ignore": ["^meteor/", "^/"] }]
  }
}
```

### Packages
#### Data
- `meteor npm install --save simpl-schema`
- `meteor add aldeed:collection2-core`
- `meteor add aldeed:schema-deny`
- `meteor add ongoworks:security`
- `meteor add aldeed:autoform`
- `meteor add reywood:publish-composite`
- `meteor add jcbernack:reactive-aggregate`
- `meteor add dburles:collection-helpers`
- `meteor add matb33:collection-hooks`
#### Ui
- `meteor add materialize:materialize`
- `meteor add kadira:dochead`
- `meteor add reactive-var`
- `meteor add amplify`
#### i18n
- `meteor add tap:i18n`
#### Users & accounts
- `meteor add accounts-password`
- `meteor add alanning:roles`
- `meteor npm install --save bcrypt`
- `meteor add accounts-facebook`
- `meteor add service-configuration`
- `meteor add softwarerero:accounts-t9n`
- `meteor add accounts-ui`
- `meteor add useraccounts:flow-routing`
- `meteor add useraccounts:materialize`
#### Mails
- `meteor add cunneen:mailgun`
#### Tests
- `meteor add msavin:mongol`
#### Utils
- `meteor npm install -s timezones.json`
- `meteor npm install all-the-cities --save`
- `meteor npm install -s country-data`

### Comments
Search for these key words :
- LIIT
- TODO
- HACK
- BUG
