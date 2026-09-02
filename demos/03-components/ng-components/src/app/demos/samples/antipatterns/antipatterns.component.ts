import { Component, computed, signal } from '@angular/core';

interface AntiPattern {
  id: number;
  category: string;
  legacy: string;
  modern: string;
  why: string;
}

const patterns: AntiPattern[] = [
  {
    id: 1,
    category: 'Component API',
    legacy: '@Input() user: User; @Output() selected = new EventEmitter<User>();',
    modern: 'readonly user = input.required<User>(); readonly selected = output<User>();',
    why: 'Signal members are typed, required aware and readable without lifecycle hooks.',
  },
  {
    id: 2,
    category: 'Component API',
    legacy: 'constructor(private http: HttpClient, private router: Router) {}',
    modern: 'private http = inject(HttpClient); private router = inject(Router);',
    why: 'inject() works in functions, guards and field initializers, and survives inheritance.',
  },
  {
    id: 3,
    category: 'Component API',
    legacy: '@HostBinding("class.active") isActive = true; @HostListener("click") onClick() {}',
    modern: 'host: { "[class.active]": "isActive()", "(click)": "onClick()" }',
    why: 'The host object keeps every host binding in the decorator and is statically analysable.',
  },
  {
    id: 4,
    category: 'Component API',
    legacy: '@NgModule({ declarations: [FeatureComponent] })',
    modern: 'Standalone components plus loadComponent and loadChildren routes.',
    why: 'NgModules add indirection without buying anything since standalone became the default.',
  },
  {
    id: 5,
    category: 'Templates',
    legacy: '<div *ngIf="show"> and <li *ngFor="let item of items">',
    modern: '@if (show()) { } and @for (item of items(); track item.id) { }',
    why: 'Built-in control flow needs no import, requires track and compiles smaller.',
  },
  {
    id: 6,
    category: 'Templates',
    legacy: '[ngClass]="{ active: isActive }" [ngStyle]="{ color: color }"',
    modern: '[class.active]="isActive()" [style.color]="color()"',
    why: 'Native bindings avoid a directive and a per change detection object diff.',
  },
  {
    id: 7,
    category: 'Templates',
    legacy: 'imports: [CommonModule]',
    modern: 'Drop it and import only the pipes you actually use.',
    why: 'Control flow lives in the compiler now, so CommonModule buys nothing.',
  },
  {
    id: 8,
    category: 'State and data',
    legacy: 'users$ = this.http.get<User[]>(url) rendered with the async pipe',
    modern: 'readonly users = httpResource<User[]>(() => url);',
    why: 'httpResource exposes value, status and error as signals and refetches reactively.',
  },
  {
    id: 9,
    category: 'State and data',
    legacy: 'users = toSignal(this.http.get<User[]>(url), { initialValue: [] });',
    modern: 'readonly users = httpResource<User[]>(() => url);',
    why: 'toSignal hides loading and error state and never refetches on its own.',
  },
  {
    id: 10,
    category: 'State and data',
    legacy: 'ngOnInit() { this.http.get(url).subscribe(v => this.data.set(v)); }',
    modern: 'readonly data = httpResource(() => url);',
    why: 'A subscription inside a component is a lifetime you then own by hand.',
  },
  {
    id: 11,
    category: 'State and data',
    legacy: 'private state$ = new BehaviorSubject<Filter>(initial);',
    modern: 'readonly state = signal<Filter>(initial);',
    why: 'Local state needs no stream, no subscription and no async pipe.',
  },
  {
    id: 12,
    category: 'State and data',
    legacy: '@ngrx/store, @ngrx/effects, @ngrx/entity and @ngrx/data',
    modern: 'signalStore() from @ngrx/signals with withState, withComputed and withMethods.',
    why: 'The signal store carries the same features with a fraction of the ceremony.',
  },
  {
    id: 13,
    category: 'Change detection',
    legacy: 'changeDetection: ChangeDetectionStrategy.Default',
    modern: 'Nothing to write. OnPush is the Angular 22 default.',
    why: 'Default change detection rechecks the component on every unrelated event.',
  },
  {
    id: 14,
    category: 'Change detection',
    legacy: 'changeDetection: ChangeDetectionStrategy.OnPush',
    modern: 'Delete the line and the ChangeDetectionStrategy import with it.',
    why: 'In Angular 22 the explicit line is noise that repeats the default.',
  },
  {
    id: 15,
    category: 'Change detection',
    legacy: 'effect(() => this.total.set(x()), { allowSignalWrites: true })',
    modern: 'readonly total = computed(() => x()); or linkedSignal() when it must be writable.',
    why: 'allowSignalWrites is gone, and writing state from an effect hides the real dependency.',
  },
  {
    id: 16,
    category: 'Removed in v22',
    legacy: 'provideHttpClient(withFetch()) or provideHttpClient(withXhr())',
    modern: 'provideHttpClient()',
    why: 'Fetch is the only backend now, so both flags are dead configuration.',
  },
  {
    id: 17,
    category: 'Removed in v22',
    legacy: 'TestBed.flushEffects()',
    modern: 'TestBed.tick()',
    why: 'tick() flushes effects and the render pipeline in one call.',
  },
  {
    id: 18,
    category: 'Removed in v22',
    legacy: 'Karma together with karma.conf.js',
    modern: 'Vitest through the @angular/build:unit-test builder.',
    why: 'Karma is removed from the CLI and the unit-test builder is the supported path.',
  },
  {
    id: 19,
    category: 'Removed in v22',
    legacy: '@angular/animations route transition triggers',
    modern: 'animate.enter and animate.leave plus view transitions.',
    why: 'The animations DSL for route transitions is retired in favour of CSS driven APIs.',
  },
];

@Component({
  selector: 'app-antipatterns',
  templateUrl: './antipatterns.component.html',
  styleUrl: './antipatterns.component.scss',
})
export class AntipatternsComponent {
  readonly all = signal(patterns);
  readonly category = signal('all');

  readonly categories = computed(() => ['all', ...new Set(this.all().map((p) => p.category))]);

  readonly visible = computed(() => {
    const selected = this.category();
    return selected === 'all' ? this.all() : this.all().filter((p) => p.category === selected);
  });
}
