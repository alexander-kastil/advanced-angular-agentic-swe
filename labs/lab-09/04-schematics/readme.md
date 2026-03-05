# Schematics

Install Schematics CLI:

```
npm i -g @angular-devkit/schematics @angular-devkit/schematics-cli
```

Create a schematics project with one schematic called `ng-schematics-intro`

```
schematics blank --name=ng-schematics-intro
cd ng-schematics-intro
```

> Note: The schematic is registered in `collection.json` and implemented in `./ng-schematics-intro/index.ts`

Build & Run Schematics locally:

```
npm run build
schematics .:ng-schematics-intro --dry-run false
```

> Note: You can also start `npm run build -- -w` in a separate terminal so it automatically rebuild your schematic project when a file changes

Add another Schematic to the same project (from inside the folder):

```
schematics blank --name=create-file
```

`collection.json` should look like this:

```json
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "ng-schematics-intro": {
      "description": "A blank schematic.",
      "factory": "./ng-schematics-intro/index#schematicsWs"
    },
    "create-file": {
      "description": "A blank schematic.",
      "factory": "./create-file/index#createFile"
    }
  }
}
```

Add the following code to `create-file/index.ts`:

```javascript
export function createFile(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const file = 'hello-world.js';
        const content = `console.log('Hello ng-adv. I hope you enjoy the class!');`;
        tree.create(file, content);

        return tree;
    };
}
```
Build & run schematics locally that should create a file in the root of your project:

```
npm run build
schematics .:create-file --dry-run false
```

Add a schematic that takes a param:

```
schematics blank --name=create-file-with-param
```

Update `create-file-with-param/index.ts`:

```javascript
export function createFileWithParam(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const name = _options.name;
        const greeting = _options.greeting;
        const fn = 'hello.js';
        if (tree.exists(fn)) {
            tree.delete(fn);
        }
        tree.create('hello.js', `console.log('${greeting} ${name}!');`);
        return tree;
    };
}
```

Examine `create-file-with-param/schema.json` and the definition of the two params:

```json
"greeting": {
    "enum": ["Hello", "Ola", "Ahoj"],
    "type": "string",
    "description": "The type of greeting we want to use",
    "default": "Hello"
  }
```

Run using:

```
npm run build
schematics .:create-file-withparam --greeting Ahoj --name Anika --dry-run false
```

Scaffold a new Schematic that generates a Component - just like `ng g c NAME` does:

```
schematics blank --name create-demo-comp
```

Add the following code to `create-demo-comp/index.ts`

```javascript
export function createDemoComp(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        console.log('Running schematics with following options', _options);
        const sourceTpl = url('./files');
        const sourceTplParametrized = apply(sourceTpl, [template({ ..._options, ...strings, addExclamation })]);
        return mergeWith(sourceTplParametrized)(tree, _context);
    };
}

export function addExclamation(value: string): string {
    return `${value}!`;
}
```

Create folder `create-demo-comp/files/__name@dasherize__` and add a file `-__name@dasherize__.component.ts` with the content:

```javascript
import { Component } from '@angular/core';

@Component({
    selector: 'demo-<%= dasherize(name) %>',
    template: `
        <app-markdown-renderer [md]="'{{md}}'"></app-markdown-renderer>
        <mat-card>
            <mat-card-header>
                <mat-card-title> {{name}} </mat-card-title>
            </mat-card-header>
            <mat-card-content>                
            </mat-card-content>
        </mat-card>
        `
})
export class Demo<%= classify(mdfile) %>Component {
    md = '<%= mdfile %>'
}
```

>Note: Adds a markdown-renderer and an empty mat-card to the component. To fully implement the schematic it wourld need to register itself and a route in demos.module.ts und update db.json

Build & run using:

```
npm run build 
schematics .:create-demo-comp --name mydemo --mdfile testfile --debug false
```

## Using a Sandbox

A Sandbox allows you to better test your schematic. To generate Sandbox from within Schematics project run:

```
ng new sandbox --routing --style scss
```

Run like you would do in an ordinary proj:

```
cd .\sandbox\
ng g ng-schematics-intro:create-file --greeting Szia --name Emese
```

Add utility scripts in `package.json` - optional:

```json
  "scripts": {
    ...
    "clean": "git checkout HEAD -- sandbox && git clean -f -d sandbox",
    "link:schematic": "npm link && cd sandbox && npm link ng-schematics-intro",
    "run:create-file": "cd sandbox && ng g ng-schematics-intro:create-file",
    "run:create-file-withparam": "cd sandbox && ng g ng-schematics-intro:create-file-withparam --greeting Szia --name Emese --dry-run false",
    "run:create-demo": "cd sandbox && ng g schematics .:create-demo-comp --name mydemo --mdfile testfile --debug false --dry-run false"
  },
```

Run in using scripts:

```
npm run build
npm run link:schematic
npm run run:create-file
```

---

Samples are inspired by [Angular Schematics Workshop](https://github.com/tomastrajan/workshop-angular-schematics) by Tomas Trajan
