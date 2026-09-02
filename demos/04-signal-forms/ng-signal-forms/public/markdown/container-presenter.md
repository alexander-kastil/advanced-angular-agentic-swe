The container owns the state, the presenters own the rendering. Here the container provides a component-scoped NgRx Signal Store and passes its signals down:

```typescript
@Component({
  selector: "app-container-presenter",
  imports: [MarkdownRendererComponent, PresenterListComponent, PresenterEditComponent],
  providers: [PersonStore],
})
export class ContainerPresenterComponent {
  protected store = inject(PersonStore);
}
```

The presenters stay dumb: signal inputs in, outputs out, no service injection.

```typescript
export class PresenterEditComponent {
  readonly person = input.required<Person>();
  readonly savePerson = output<Person>();

  personModel = linkedSignal(() => ({ ...this.person() }));

  personForm = form(this.personModel, (s) => {
    required(s.name, { message: "Name is required" });
    minLength(s.name, 3, { message: "Min 3 characters" });
  });
}
```

`linkedSignal()` gives the edit form a local, writable copy that re-seeds itself whenever a different person is selected, so editing never mutates the store directly.

Start `json-server db.json` before opening this demo.
