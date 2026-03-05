## Signal Forms - Pets (List / Detail / Edit with On-Change Tracking)

Adapted from [DeborahK/angular-signal-forms](https://github.com/DeborahK/angular-signal-forms/) vehicle demos.

- **`form()`** from `@angular/forms/signals` binds a `signal<PetFormModel>()` to the template via `[formField]`
- **Validation** uses `required()`, `min()`, `max()` with custom messages
- **`submit()`** marks all fields touched and only calls the callback when valid
- **On-change tracking** via `effect()` — every model mutation is logged to the change log panel
- Select a pet from the list → detail populates the form → edit and save
- Click **+ New Pet** to create a new entry
