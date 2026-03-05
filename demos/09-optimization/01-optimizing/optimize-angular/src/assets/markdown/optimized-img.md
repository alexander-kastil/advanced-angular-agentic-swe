- Examine the following code snippet in `intro.component.html`. The image is loaded using the `ngSrc` directive.

    ```html
    <img ngSrc="assets/images/{{ img }}" width="600" height="300" 
        fetchpriority="high" alt="Module Image" />
    ```

- Use Lighthouse to share performance gains compared with the original `src`-tag.