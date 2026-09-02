# Host Bindings and Listeners

`@HostBinding` and `@HostListener` are retired. Every host property, attribute, class, style and event goes into the `host` object of the `@Component` or `@Directive` decorator, where the whole host surface is visible in one place and statically analysable.

## Binding a value to the host element

```typescript
@Component({
  selector: 'app-binding',
  templateUrl: './binding.component.html',
  host: {
    '[attr.isChecked]': 'checked()',
  },
})
export class BindingComponent {
  checked = signal(false);
}
```

Toggle the slide toggle and inspect the `app-binding` element: the attribute follows the signal.

## Listening on the host element

```typescript
@Directive({
  selector: '[hoverListener]',
  host: {
    '(mouseover)': 'onHover()',
    '[attr.wasHovered]': 'wasHovered()',
  },
})
export class HoverListenerDirective {
  protected wasHovered = signal(0);

  onHover() {
    this.wasHovered.update((v) => v + 1);
  }
}
```

Hover the div and watch `wasHovered` count up in the DOM.

## Syntax

| Key | Meaning |
| --- | --- |
| `'[class.active]'` | class binding |
| `'[style.width.px]'` | style binding with a unit |
| `'[attr.aria-label]'` | attribute binding |
| `'[disabled]'` | DOM property binding |
| `'(click)'` | event listener |
| `'role'` | static attribute value |

The right-hand side is an expression evaluated against the class instance, so signals are called: `'checked()'`, not `'checked'`.

![hostbinding](/assets/images/hostbinding.png)
