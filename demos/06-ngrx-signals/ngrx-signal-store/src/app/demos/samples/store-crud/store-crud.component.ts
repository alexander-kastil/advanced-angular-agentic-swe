import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-store-crud',
    templateUrl: './store-crud.component.html',
    styleUrl: './store-crud.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreCrudComponent {

}
