Examine `standalone.component.ts`. It imports all the modules it uses:

```typescript
@Component({
  selector: 'app-standalone',
  standalone: true,
  imports: [CommonModule, MarkdownModule, MdRendererModule],
  templateUrl: './standalone.component.html',
  styleUrls: ['./standalone.component.scss'],
})
export class StandaloneComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
```

The component was generated using the `--standalone flag`:

```bash
ng g c demos/samples/standalone --standalone
```