# Optimize Images

Images are usually the largest thing a page downloads and almost always the LCP element.
`NgOptimizedImage` from `@angular/common` turns the browser's image rules into compile-time errors.

## Use it

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
})
```

```html
<img ngSrc="images/optimize.jpg" width="600" height="300" priority alt="Module overview" />
```

`ngSrc` replaces `src`. The directive then:

- requires `width` and `height`, which reserves layout space and removes the CLS the image would cause
- sets `loading="lazy"` and `decoding="async"` unless the image is marked `priority`
- generates a `srcset` from the configured breakpoints so a phone does not download a desktop image
- warns in the console when the downloaded file is much larger than the rendered size
- warns when more than one image on the page is marked `priority`

## priority is for exactly one image

```html
<img ngSrc="hero.jpg" width="1200" height="600" priority alt="" />
```

`priority` emits a `<link rel="preload">` and `fetchpriority="high"`, so the browser starts the download
before it has parsed the CSS. Use it for the LCP candidate and nothing else: several preloads compete
for the same bandwidth and each one makes the others slower.

## fill for unknown sizes

```html
<div class="frame">
  <img ngSrc="cover.jpg" fill alt="" />
</div>
```

```scss
.frame { position: relative; aspect-ratio: 16 / 9; }
.frame img { object-fit: cover; }
```

With `fill` the image sizes itself to a positioned parent, so `width` and `height` are not required. The
parent still needs a reserved size, otherwise the layout shift is back.

## placeholder

```html
<img ngSrc="photo.jpg" width="800" height="600" placeholder alt="" />
```

Renders a blurred low-quality preview while the full image downloads. With a CDN loader the preview is
generated automatically; otherwise pass a data URI.

## Serve through a CDN

```typescript
providers: [
  provideImgixLoader('https://my-account.imgix.net/'),
]
```

Built-in loaders exist for Imgix, Cloudinary, ImageKit, Cloudflare and Netlify. For anything else,
provide `IMAGE_LOADER` yourself:

```typescript
{
  provide: IMAGE_LOADER,
  useValue: (config: ImageLoaderConfig) =>
    `https://cdn.example.com/${config.src}?w=${config.width}&fm=webp`,
}
```

## Beyond the directive

- Ship AVIF or WebP. A JPEG hero is often three times the size of the same image in AVIF.
- Size the file to the largest rendered size, not to the original camera output.
- `alt=""` is correct for decorative images. A missing `alt` attribute is not.
- SVG does not need `NgOptimizedImage`. Inline it or serve it with a long cache header.

## In the demo

Toggle between `ngSrc` and a plain `src` and watch the Network panel: with the directive the hero is
preloaded and the gallery below the fold is lazy.
