import { Component, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';

const A = 65;
const Z = 90;
const ZERO = 48;
const NINE = 57;
const SPACE = 32;

@Component({
  selector: 'ux-select-filter',
  imports: [
    ReactiveFormsModule,
    ProgressBarComponent
  ],
  template: `
  <form [formGroup]="searchForm" class="filter-form" [style.background-color]="color() || 'white'">
    <div class="field">
      <label class="sr-only" for="ux-select-filter-value">{{ placeholder() || 'Filter' }}</label>
      <input #input id="ux-select-filter-value" class="input" [placeholder]="placeholder()" formControlName="value" (keydown)="handleKeydown($event)">
      @if (localSpinner()) {
        <app-progress-bar mode="indeterminate" />
      }
    </div>
    @if (noResults()) {
      <div class="noResultsMessage">
        {{noResultsMessage()}}
      </div>
    }
  </form>
  `,
  styleUrls: ['./mat-select-filter.component.scss']
})
export class SelectFilterComponent {
  private fb = inject(FormBuilder);
  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement> | undefined;

  readonly array = input.required<any>();
  readonly placeholder = input('');
  readonly color = input('');
  readonly displayMember = input('');
  readonly showSpinner = input(true);
  readonly noResultsMessage = input('No results');
  readonly hasGroup = input(false);
  readonly groupArrayName = input('');

  noResults = signal(false);
  localSpinner = signal(false);
  filteredReturn = output<any>();

  public filteredItems: any = [];
  public searchForm: FormGroup;

  constructor() {
    this.searchForm = this.fb.group({
      value: ''
    });
    this.setupFormTracking();
    this.setupInitialFocus();
  }

  private setupFormTracking() {
    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.handleSearchChange(value));
  }

  private setupInitialFocus() {
    setTimeout(() => {
      this.input?.nativeElement.focus();
    }, 500);
  }

  private handleSearchChange(value: any) {
    if (this.showSpinner()) {
      this.localSpinner.set(true);
    }
    if (value['value']) {
      if (this.displayMember() == null) {
        this.filteredItems = this.array().filter((name: string) => name.toLowerCase().includes(value['value'].toLowerCase()));
      } else if (this.hasGroup() && this.groupArrayName() && this.displayMember()) {
        this.filteredItems = this.array().map((a: any) => {
          const objCopy = Object.assign({}, a);
          objCopy[this.groupArrayName()] = objCopy[this.groupArrayName()].filter((g: { [x: string]: string; }) => g[this.displayMember()].toLowerCase().includes(value['value'].toLowerCase()));
          return objCopy;
        }).filter((x: { [x: string]: string | any[]; }) => x[this.groupArrayName()].length > 0);
      } else {
        this.filteredItems = this.array().filter((name: { [x: string]: string; }) => name[this.displayMember()].toLowerCase().includes(value['value'].toLowerCase()));
      }
      this.noResults.set(this.filteredItems == null || this.filteredItems.length === 0);
    } else {
      this.filteredItems = this.array().slice();
      this.noResults.set(false);
    }
    this.filteredReturn.emit(this.filteredItems);
    setTimeout(() => {
      if (this.showSpinner()) {
        this.localSpinner.set(false);
      }
    }, 2000);
  }

  handleKeydown(event: KeyboardEvent) {
    if ((event.key && event.key.length === 1) ||
      (event.keyCode >= A && event.keyCode <= Z) ||
      (event.keyCode >= ZERO && event.keyCode <= NINE) ||
      (event.keyCode === SPACE)) {
      event.stopPropagation();
    }
  }
}
