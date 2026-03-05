import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-customers-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <div class="toolbar">
      <button mat-raised-button color="primary" (click)="add.emit()">Add Customer</button>
    </div>
    @if (loading()) {
      <mat-progress-bar mode="indeterminate" />
    }
    <mat-table [dataSource]="customers()">
      <ng-container matColumnDef="id">
        <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
        <mat-cell *matCellDef="let c">{{ c.id }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="name">
        <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
        <mat-cell *matCellDef="let c">{{ c.name }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="actions">
        <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
        <mat-cell *matCellDef="let c">
          <button mat-icon-button color="primary" (click)="edit.emit(c)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="delete.emit(c.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-cell>
      </ng-container>
      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
    </mat-table>
  `,
  styles: [`
    .toolbar { margin-bottom: 1rem; }
  `]
})
export class CustomersTableComponent {
  customers = input.required<Customer[]>();
  loading = input(false);
  edit = output<Customer>();
  delete = output<number>();
  add = output<void>();

  displayedColumns = ['id', 'name', 'actions'];
}
