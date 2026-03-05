- Examine bundle limits in angular.json. 

- Find Moment.js and look at its size

- Replace Moment.js by date-fns in `bundles.component.ts`

  ```
  npm install date-fns --save
  npm uninstall moment
  ```

- Use the following functions:

  ```
  addDays(date, amount)
  format(new Date(2016, 0, 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
  ```

- Notice the change in total bundle size