- Examine `sidepanel.service.ts` to see how `signal()` replaces `BehaviorSubject` for a stateful singleton service:

```typescript
@Injectable({ providedIn: 'root' })
export class SidePanelService {
  private commands = signal<SidebarActions>(SidebarActions.HIDE_MARKDOWN);
  readonly currentCommand = this.commands.asReadonly();

  triggerCmd(action: SidebarActions) {
    this.commands.set(action);
  }
}
```

- `asReadonly()` exposes the signal to consumers without allowing writes — encapsulation without a separate `Observable` + `Subject` pair

- Examine `demo-container.component.html` — the signal is read directly in the template with `@if`, no `async` pipe needed:

```html
@if (showMdEditor()) {
  <app-markdown-editor />
}
```
