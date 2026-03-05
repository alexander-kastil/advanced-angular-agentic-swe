## httpResource() Pattern

`httpResource()` from `@angular/common/http` is the declarative, signal-based replacement for `HttpClient` + `BehaviorSubject` state tracking.

## Comparison

|                 | HttpClient + BehaviorSubject | httpResource()            |
| --------------- | ---------------------------- | ------------------------- |
| Loading state   | Manual                       | `resource.isLoading()`    |
| Error state     | Manual                       | `resource.error()`        |
| Data            | `.value` on BehaviorSubject  | `resource.value()`        |
| Refresh         | Call service method again    | `resource.reload()`       |
| Reactive params | Manual switchMap             | Reactive request function |

## Basic Usage

```typescript
import { httpResource } from '@angular/common/http';

@Component({ ... })
export class SkillListComponent {
  // Reactive request function — re-fetches when signal changes
  protected skillsResource = httpResource<Skill[]>(() => `${environment.api}skills`);
}
```

```html
@if (skillsResource.isLoading()) {
<mat-progress-bar mode="indeterminate" />
} @else if (skillsResource.error()) {
<p>Error loading data</p>
} @else { @for (skill of skillsResource.value(); track skill.id) {
<mat-chip>{{ skill.name }}</mat-chip>
} }
```

## Reactive Parameters

```typescript
protected selectedId = signal(1);
protected detail = httpResource<Skill>(() => `${environment.api}skills/${this.selectedId()}`);
// Automatically re-fetches whenever selectedId changes
```
