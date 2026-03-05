Investigate router.animations.ts

Reference Router Animation in demo-container.component.ts:

```typescript
import { routeAnimation } from '../router.animations';

@Component({
  selector: 'app-demo-container',
  templateUrl: './demo-container.component.html',
  styleUrls: ['./demo-container.component.scss'],
  animations: [routeAnimation],
})
export class DemoContainerComponent implements OnInit {
```

Decorate the parent container of router-outlet in demo-container.component.html:

```html
<div class="workbench"
[@routeAnimation]="o.isActivated ? o.activatedRoute : ''">
<router-outlet #o="outlet"></router-outlet>
```
