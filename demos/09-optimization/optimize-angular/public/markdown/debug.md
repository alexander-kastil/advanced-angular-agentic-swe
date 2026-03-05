# Use Angular Debug statements

Open Chrome Dev Tools - Select the DebugStatementsComponent using Elements Inspector

```
<app-debug-statements></app-debug-statements>
```

Open Console (ESC) and type:

```
ng.getComponent($0)
```

Update a prop:

```
ng.getComponent($0).msg = "abc"
ng.applyChanges($0)
```

Get the parent of the component:

```
ng.getOwningComponent($0)
```

Get the Data Context:

```
ng.getContext($0)
```
