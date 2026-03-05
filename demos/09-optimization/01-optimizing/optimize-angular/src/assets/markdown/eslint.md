- Add ESLint:

  ```
  ng lint
  ng add @angular-eslint/schematics
  ```

  >Note: If you are running this command for the first time you will be asked to install linting support

- You can add the following linting rules to your project to incluce acessibility linting `.eslintrc.json`:

  ```json
  {
    "files": [
      "*.html"
    ],
    "extends": [
      "plugin:@angular-eslint/template/recommended"
    ],
    "rules": {
      "@angular-eslint/template/accessibility-alt-text": "error",
      "@angular-eslint/template/accessibility-elements-content": "error",
      "@angular-eslint/template/accessibility-label-has-associated-control": "error",
      "@angular-eslint/template/accessibility-table-scope": "error",
      "@angular-eslint/template/accessibility-valid-aria": "error",
      "@angular-eslint/template/button-has-type": "error"
    }
  },
  {
    "files": ["*.component.html"],
    "parser": "@angular-eslint/template-parser",
    "parserOptions": {
      "project": "./tsconfig.app.json",
      "ecmaVersion": 2020,
      "sourceType": "module"
    },
    "plugins": ["@angular-eslint/template"]
  }
  ```

- Some rules are auto fixable with 

  ```
  ng lint --fix
  ```