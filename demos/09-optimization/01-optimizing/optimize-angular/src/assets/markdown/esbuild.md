- ES Build is a JavaScript bundler and minifier written in Go. It is known for its speed and is used by many popular projects such as React, Vue, and is available as a Developer Preview starting with Angular 16.

  ```json
  "architect": {
          "build": {
            "builder": "@angular-devkit/build-angular:browser-esbuild",
  ```

- With Angular 17 this became the default bundler