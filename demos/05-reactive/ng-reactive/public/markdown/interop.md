## Observable → Signal with toSignal()

`toSignal()` from `@angular/core/rxjs-interop` converts any Observable into a read-only Angular signal.

## Why Use It

|                          | async pipe             | toSignal()          |
| ------------------------ | ---------------------- | ------------------- |
| Template syntax          | `{{ data$ \| async }}` | `{{ data() }}`      |
| Optional chaining        | Required `?.`          | Not needed          |
| Reusable in `computed()` | ❌                     | ✅                  |
| Multiple subscribers     | New subscribe each     | Single subscription |
| Works in `effect()`      | ❌                     | ✅                  |

## Usage

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ ... })
export class SkillListComponent {
  private service = inject(SkillsService);

  // Observable → Signal — subscription managed automatically
  protected skills = toSignal(this.service.getSkills(), { initialValue: [] });
}
```

```html
@for (skill of skills(); track skill.id) {
<mat-chip>{{ skill.name }}</mat-chip>
}
```

## initialValue

Required when the Observable is async (HTTP) so the signal has a value before the first emission:

```typescript
data = toSignal(this.http.get<Item[]>("/api/items"), { initialValue: [] });
```

Use `requireSync: true` only when the source is guaranteed synchronous (e.g., `of(...)`).

---

## 2026 Context

Prefer `toSignal()` over async pipe for new code. Use async pipe only when integrating existing Observable-based libraries or for quick template consumption.
