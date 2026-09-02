import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CodePanelComponent } from '../../../shared/code-panel/code-panel.component';

@Component({
  selector: 'app-route-params-signals',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CodePanelComponent],
  templateUrl: './route-params-signals.component.html',
  styleUrl: './route-params-signals.component.scss',
})
export class RouteParamsSignalsComponent {
  readonly ids = ['1', '2', '3', '99'];

  readonly providers = `provideRouter(appRoutes, withComponentInputBinding())`;

  readonly child = `export class DishParamsComponent {
  readonly id = input.required<string>();
  readonly highlight = input('');

  readonly dish = httpResource<FoodItem>(() => \`\${environment.api}food/\${this.id()}\`);
}`;

  readonly replaced = `private readonly route = inject(ActivatedRoute);
private readonly id = toSignal(
  this.route.paramMap.pipe(map((params) => Number(params.get('id'))))
);`;
}
