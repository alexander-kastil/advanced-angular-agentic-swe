import {
  A,
  NINE,
  SPACE,
  Z,
  ZERO
} from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ux-select-filter',
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  template: `
  <form [formGroup]="searchForm" class="mat-filter" [style.background-color]="color() || 'white'">
    <div>
      <input #input class="mat-filter-input" matInput [placeholder]="placeholder()" formControlName="value" (keydown)="handleKeydown($event)">
      @if (localSpinner()) {
        <mat-spinner class="spinner" diameter="16" />
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatSelectFilterComponent {
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
    if (!this.placeholder()) {
      // Note: placeholder is readonly input, initial value can be set via binding
    }
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
