
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-lazy-standalone',
    imports: [RouterModule],
    templateUrl: './lazy-standalone.component.html',
    styleUrls: ['./lazy-standalone.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyStandaloneComponent {
}
