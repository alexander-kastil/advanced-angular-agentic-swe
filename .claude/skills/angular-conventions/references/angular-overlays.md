# Angular Overlays, Dialogs & Popups

Patterns for modal dialogs, confirm popups, and any overlay UI. Covers ESC-to-close,
nested-overlay handling, and making native browser controls match a dark theme.

## A dialog the user can link to is a CHILD ROUTE, not a component signal

A dialog held open by a `dialogOpen` signal has no URL, cannot be linked to, cannot be reopened by
the back button, and gets copy-pasted: one signal in the page header and a second in the sidebar,
both rendering the same component. Make it a child of the list route instead. The parent page hosts
the outlet, the child paints its own scrim, and closing is a navigation.

```ts
{
  path: 'repos',
  loadComponent: () => import('./apps/repos-page').then((m) => m.ReposPage),
  children: [
    { path: 'new',          loadComponent: () => import('./apps/register-repo-dialog').then((m) => m.RegisterRepoDialog) },
    { path: 'edit/:repoId', loadComponent: () => import('./apps/register-repo-dialog').then((m) => m.RegisterRepoDialog) },
  ],
}
```

```html
<!-- repos-page.html, last element -->
<router-outlet />
```

```ts
close() { this.router.navigate(['/repos']); }
```

Every trigger anywhere in the app then becomes `routerLink="/repos/new"`, and the duplicated open
state disappears with it.

Three things that decide whether this works:

- **Children, not siblings.** A sibling route cannot render into the parent page's outlet, and a
  sibling `repos/new` also loses the race to an earlier `repos/:repoId`. Declared as children of
  `repos`, the overlay paths match first because Angular walks the config in order.
- **Never `:id/<verb>` when a two-segment route already exists.** `repos/:repoId/edit` is
  indistinguishable from `repos/:repoId/:environmentId`, and the guard on the second one will happily
  treat `edit` as an environment id. Put the verb first: `repos/edit/:repoId`.
- **Mode comes from the route, not from an input the caller sets.** `data: { isNew: true }` or the
  presence of the `:repoId` param decides create versus edit, so one component serves both without a
  parent deciding for it.

Aux outlets (`{ outlets: { modal: [...] } }`) solve a different problem: an overlay that must sit
above ANY page rather than one list. For a dialog that belongs to a single page, the child route is
smaller and its URL reads properly.

**A routed overlay with no `routerLink` anywhere is a dead feature.** Nothing lists routes for the
user, so a route reachable only by typing it does not exist. Whenever a route is added, name the
element that navigates to it in the same change.

## Close-on-ESC as a reusable directive (not per-component listeners)

Do **not** scatter `@HostListener('document:keydown.escape')` across every component
that owns a popup. It does not compose: when a confirm dialog is shown over an edit
dialog, both listeners fire on ESC and both close — the user loses their whole form.

Instead use one attribute directive backed by a shared stack so only the **topmost**
overlay reacts. Because overlays live inside `@if (visible())`, the directive instance
is created/destroyed with the popup, so it self-registers and self-unregisters — no
`visible()` guard needed inside the handler.

```ts
// shared/close-on-escape/escape-stack.service.ts
import { Injectable } from '@angular/core';
import type { CloseOnEscape } from './close-on-escape.directive';

@Injectable({ providedIn: 'root' })
export class EscapeStack {
  private readonly stack: CloseOnEscape[] = [];
  push(dir: CloseOnEscape): void { this.stack.push(dir); }
  remove(dir: CloseOnEscape): void {
    const i = this.stack.lastIndexOf(dir);
    if (i !== -1) this.stack.splice(i, 1);
  }
  isTopmost(dir: CloseOnEscape): boolean {
    return this.stack[this.stack.length - 1] === dir;
  }
  hasOpen(): boolean { return this.stack.length > 0; }
}
```

```ts
// shared/close-on-escape/close-on-escape.directive.ts
import { Directive, HostListener, OnDestroy, OnInit, inject, output } from '@angular/core';
import { EscapeStack } from './escape-stack.service';

@Directive({ selector: '[appCloseOnEscape]' })
export class CloseOnEscape implements OnInit, OnDestroy {
  private readonly stack = inject(EscapeStack);

  // alias === selector → consume it like a native event: (appCloseOnEscape)="..."
  readonly closed = output<void>({ alias: 'appCloseOnEscape' });

  ngOnInit(): void { this.stack.push(this); }
  ngOnDestroy(): void { this.stack.remove(this); }

  // $event is typed Event, NOT KeyboardEvent — typing it KeyboardEvent is a TS2345
  // build error ("Argument of type 'Event' is not assignable to KeyboardEvent").
  @HostListener('document:keydown.escape', ['$event'])
  protected onEscape(event: Event): void {
    if (this.stack.isTopmost(this)) {
      event.stopPropagation();
      this.closed.emit();
    }
  }
}
```

Usage on each overlay root (the `@if`-gated element):

```html
<div class="fixed inset-0 ..." role="dialog" aria-modal="true"
     (appCloseOnEscape)="cancelled.emit()">
  ...
</div>
```

### Key points

- **`output({ alias: '<selector>' })`** lets the directive be bound like a native event.
  Just adding `(appCloseOnEscape)="..."` also satisfies the `[appCloseOnEscape]` selector,
  so no bare attribute is needed — exactly like `(click)`.
- **Topmost-only** dispatch fixes nested popups (confirm over dialog). Registration order
  follows component init order, so the most recently opened overlay is last in the stack.
- For a component that has **non-modal** inline ESC behavior (e.g. stop an inline video,
  collapse an inline panel) alongside directive-managed modals, keep its `@HostListener`
  but guard it: `if (this.escapeStack.hasOpen()) return;` so it defers to open overlays.
- Centralizing this also removes duplicated `host: { '(document:keydown.escape)': ... }`
  blocks from shared dialog components.

## Native browser controls in a dark theme

Native `<input type="time|date">` picker popups, `<select>` dropdown lists, calendar
popups, and scrollbars are rendered by the browser, not your CSS — they default to the
OS light theme and look wrong inside a dark dialog. Opt every native control into dark
rendering with one line:

```css
/* styles.css */
html,
body {
  color-scheme: dark;
}
```

This is the correct fix — not re-skinning each control with brittle
`::-webkit-calendar-picker-indicator` / `appearance: none` hacks. Verify the actual
native popup (open the time picker) in Chrome, since the picker chrome is outside the
DOM/a11y snapshot and only shows in a screenshot.
