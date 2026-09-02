import { Component, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';

const KEY_A = 65;
const KEY_Z = 90;
const KEY_ZERO = 48;
const KEY_NINE = 57;
const KEY_SPACE = 32;

@Component({
  selector: 'ux-select-filter',
  imports: [
    ReactiveFormsModule,
    ProgressBarComponent
  ],
  template: `
  <form [formGroup]="searchForm" class="filter-form" [style.background-color]="color() || 'white'">
    <div>
      <label class="sr-only" for="ux-select-filter-input">{{ placeholder() || 'Filter' }}</label>
      <input #input id="ux-select-filter-input" class="filter-input" [placeholder]="placeholder()" formControlName="value" (keydown)="handleKeydown($event)">
      @if (localSpinner()) {
        <app-progress-bar class="filter-progress" mode="indeterminate" />
      }
    </div>
    @if (noResults()) {
      <div class="noResultsMessage">
        {{noResultsMessage()}}
      </div>
    }
  </form>
  `,
  styleUrls: ['./mat-select-filter.component.scss'],
})
export class MatSelectFilterComponent {
  private fb = inject(FormBuilder);
  readonly input = viewChild<ElementRef<HTMLInputElement>>('input');

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
      this.input()?.nativeElement.focus();
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
      (event.keyCode >= KEY_A && event.keyCode <= KEY_Z) ||
      (event.keyCode >= KEY_ZERO && event.keyCode <= KEY_NINE) ||
      (event.keyCode === KEY_SPACE)) {
      event.stopPropagation();
    }
  }
}
