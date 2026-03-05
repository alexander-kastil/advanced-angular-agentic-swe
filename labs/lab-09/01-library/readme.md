# Angular Libraries

[Angular Library Docs](https://angular.io/guide/libraries)

[Multiple Projects - Angular File Structure](https://angular.io/guide/file-structure)

## Getting Started

Create a host project & Add Material & Flex Layout:

```
ng new ux-lib --routing --style scss --routing=false --ssr=false
cd ux-lib
ng add @angular/material
```

>Note: Use this settings when adding material:

![material](_images/material.jpg)

Create Library:

```
ng g library ux-controls --prefix=ux
```

In `projects\ux-controls\lib\` delete the service `ux-controls.service.ts`, `ux-controls.component.ts` and its \*.spec-files. Remove it from `ux-controls.module.ts` and `public-api.ts`

### Implement a the Split Control

Implement a split component that divides the screen in a T-layout:

```
ng g c controls/split --project=ux-controls
```

>Note: The default stylesheet is *.css. You can change this behaviour by executing: 

```bash
ng config projects.ux-controls.schematics.@schematics/angular:component.style scss
```

Update the imports in `split.component.ts`:

```typescript
@Component({
  selector: 'ux-split',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './split.component.html',
  styleUrl: './split.component.scss'
})
export class SplitComponent { }
```

>Note: The "ng g c ..." cli call does not register the component in the module. This must be done manually as seen above.

Update PeerDependencies in `package.json` of the library:

```typescript
"peerDependencies": {
    "@angular/common": "^17.1.0",
    "@angular/core": "^17.1.0",
    "@angular/animations": "^17.1.0",
    "@angular/material": "^17.1.0"
  },
```

> Note: You might want to change version numbers depending on the current versions

split.component.html

```html
<div class="maingrid">
  <div class="title">
    <mat-toolbar>
      <mat-toolbar-row color="primary">
        <ng-content select=".title"></ng-content>
      </mat-toolbar-row>
    </mat-toolbar>
  </div>
  <div class="main">
    <ng-content select=".main"></ng-content>
  </div>
  <div class="sidebar">
    <ng-content select=".sidebar"></ng-content>
  </div>
</div>
```

split.component.scss:

```css
.maingrid {
  display: grid;
  grid-template-rows: 60px auto;
  grid-template-columns: auto 180px;
  grid-template-areas: "title title" "main sidebar";
  height: 100vh;
  width: 100%;
}

.title{
  grid-area: title;
  background-color: lavender;
}

.main{
  padding: 1rem;
  grid-area: main;
  background-color: yellow;
}

.sidebar{
  padding: 1rem;
  grid-area: sidebar;
  background-color: lightblue;
}
```

Modify `public-api.ts`:

```typescript
export * from './lib/controls/split/split.component';
```

Build Library:

```
ng build --project ux-controls
```

> Note: You could also run `ng build ux-controls` or use the `--watch` flag

### Use the Split Control

Update the imports in `app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { SplitComponent } from '../../projects/ux-controls/src/public-api';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SplitComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ux-lib';
}
```

Add it to `app.component.html` and run `ng s -o`:

```html
<ux-split>
  <div class="title">UX Split</div>
  <div class="main">Main Content</div>
  <div class="sidebar">Sidebar Buttons</div>
</ux-split>
```

Test the component:

```
ng serve -o --project ux-lib
```