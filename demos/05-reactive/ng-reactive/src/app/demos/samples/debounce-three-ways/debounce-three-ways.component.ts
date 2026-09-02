import { Component, computed, debounced, effect, signal, untracked, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounce, form, FormField } from '@angular/forms/signals';
import { debounceTime } from 'rxjs';

type Lane = 'control' | 'signal' | 'form';
type Counts = Record<Lane, number>;

@Component({
  selector: 'app-debounce-three-ways',
  templateUrl: './debounce-three-ways.component.html',
  imports: [FormsModule, ReactiveFormsModule, FormField],
  styles: `
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: start; }
    .grid .card + .card { margin-top: 0; }
    .row { display: flex; justify-content: space-between; gap: 8px; font-family: monospace; font-size: 0.82rem; padding: 3px 0; border-bottom: 1px solid var(--color-line); }
    .row span:last-child { font-weight: 600; }
    .pending { color: #b45309; font-weight: 700; font-size: 0.8rem; min-height: 1.3rem; }
  `,
})
export class DebounceThreeWaysComponent {
  protected readonly wait = 500;

  protected control = new FormControl('', { nonNullable: true });
  protected rawControl = toSignal(this.control.valueChanges, { initialValue: '' });
  protected debouncedControl = toSignal(this.control.valueChanges.pipe(debounceTime(this.wait)), {
    initialValue: '',
  });
  protected controlPending = computed(() => this.rawControl() !== this.debouncedControl());

  protected typed = signal('');
  protected debouncedSignal = debounced(this.typed, this.wait);

  protected model = signal({ query: '' });
  protected searchForm = form(this.model, (path) => {
    debounce(path.query, this.wait);
  });
  protected formRaw = computed(() => this.searchForm.query().controlValue());
  protected formPending = computed(() => this.formRaw() !== this.model().query);

  protected keystrokes = signal<Counts>({ control: 0, signal: 0, form: 0 });
  protected settled = signal<Counts>({ control: 0, signal: 0, form: 0 });

  constructor() {
    this.count(() => this.rawControl(), this.keystrokes, 'control');
    this.count(() => this.typed(), this.keystrokes, 'signal');
    this.count(() => this.formRaw(), this.keystrokes, 'form');

    this.count(() => this.debouncedControl(), this.settled, 'control');
    this.count(() => this.debouncedSignal.value(), this.settled, 'signal');
    this.count(() => this.model().query, this.settled, 'form');
  }

  private count(source: () => unknown, target: WritableSignal<Counts>, lane: Lane) {
    let primed = false;
    effect(() => {
      source();
      if (!primed) {
        primed = true;
        return;
      }
      untracked(() => target.update((counts) => ({ ...counts, [lane]: counts[lane] + 1 })));
    });
  }
}
