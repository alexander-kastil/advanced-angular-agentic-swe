# Replace the Scattered Signals with a SignalStore

State is spread across three components. `App` owns the lists and the selection, `SecretsList`
owns the search, the filter and its own request, `SecretDetail` owns the open secret, and none of
them can see the others. In this lab all of it moves into one `SecretsStore` assembled from three
features, each written with `withEntities`, so the components read state and call methods and
own nothing.

------

Work in [`l06-secrets-vault-starter/`](./l06-secrets-vault-starter/). Run `claude` from the
repository root and `npm` commands in the app folder. The finished result is in
[`l06-secrets-vault-solution/`](./l06-secrets-vault-solution/).

```bash
cd labs/lab-06/l06-secrets-vault-starter
npm install
npm start
```

---

## Step 1: Decide what a feature owns

Overview: a store built as one flat blob grows into the same tangle it replaced. Splitting it by
the thing being stored keeps each part testable, and the boundaries decide which feature may read
which state.

```bash
npm install @ngrx/signals
```

Research:

```text
The workbench holds three kinds of data: secret lists with a selected one, the secrets of that
list with a search term and a category filter and an open secret, and the categories of that
list. I want one SecretsStore composed from three signalStoreFeature functions.

Propose the split. For each feature say what goes in withState, what belongs in withEntities and
under which collection name, which computed values it exposes, and which methods it owns. Then
say which of the three features have to declare an input state dependency on the others, and how
signalStoreFeature expresses that.
```

Finding: the answer must place the selection in the lists feature and have both the secrets and
the categories feature declare a dependency on `selectedListId`, because both load per list. That
dependency is written as an input-state argument in the `signalStoreFeature` call, using the
`type<...>()` helper, and it is the part most answers omit. Push back if a feature reads
`selectedListId` without declaring it, or if the selection ends up duplicated in two features.

Recipe:

```text
Create src/app/store/with-lists.ts exporting a withLists() signalStoreFeature. It carries
withEntities for SecretList under the collection name list, a withState holding selectedListId
and listsLoading, computed values secretsLists, vaultLists and selectedList, and methods
selectList and loadLists. loadLists GETs /api/lists, writes the rows with setAllEntities keyed on
listId, and selects the first list when nothing is selected yet.
```

Expected Outcome: `npx tsc --noEmit -p tsconfig.app.json` is clean, and the feature exposes the
entity signals the collection name generates:

```text
listEntities()  listIds()  listEntityMap()
```

---

## Step 2: Add the secrets feature and its dependency on the selection

Overview: the secrets feature cannot own the selected list, but it has to react to it. Declaring
that state as an input makes the dependency explicit and type-checked rather than assumed.

Recipe:

```text
Create src/app/store/with-secrets.ts exporting withSecrets(). Its first argument declares an
input state of selectedListId as string | null with the type helper. It carries withEntities for
Secret under the collection name secret, a withState holding search, selectedCategoryIds,
openSecretId and secretsLoading, computed values visibleSecrets and openSecret, and methods
setSearch, setCategoryFilter, openSecretById, loadSecrets and saveSecret.

loadSecrets builds /api/secrets?listId=<selected> plus search when the term is non-empty and
writes the rows with setAllEntities keyed on secretId. saveSecret PUTs the update, patches the
one row with updateEntity, and returns the updated secret.

Create src/app/store/with-categories.ts the same way: the same input state, withEntities for
Category under the collection name category, and a loadCategories method.
```

Expected Outcome: `visibleSecrets` narrows by the category filter while `secretEntities` stays
whole, so the guide's count line can show both numbers. The typecheck fails if the input state
declaration is dropped, which is the point of declaring it.

---

## Step 3: Assemble the store and load on change

Overview: composition order matters, because a feature can only see state declared before it.
`withHooks` is where the store starts its own life instead of waiting for a component to remember
to call it.

Recipe:

```text
Create src/app/store/secrets-store.ts exporting SecretsStore from signalStore with
providedIn: 'root', composing withLists(), withSecrets() and withCategories() in that order.

Add withHooks with an onInit that calls loadLists once, then registers an effect reading
selectedListId and search and calling loadSecrets and loadCategories inside untracked, so writing
store state from the loaders does not re-trigger the effect.
```

Expected Outcome: the app loads without any component calling a loader. Switching lists refetches
both the secrets and the categories, and typing in the search box refetches only the secrets:

```text
GET /api/lists
GET /api/secrets?listId=a9794369-...   GET /api/categories?listId=a9794369-...
GET /api/secrets?listId=a9794369-...&search=faq
```

---

## Step 4: Empty the components

Overview: with the store in place every component-owned signal is a duplicate. The measure of
this step is how much comes out, not how much goes in.

Recipe:

```text
Rewrite the components to read the store and own nothing:

App injects SecretsStore, drops the lists httpResource, the linkedSignal, the categories resource
and the openSecret signal, and keeps only the splitter view query and the document-title effect.

SecretLists becomes fully presentational: required inputs secretsLists and vaultLists, an input
selectedListId and an output listSelected, with no model and no filtering of its own.

SecretsList injects the store, drops its httpResource, its search signal, its debounced wrapper
and its category signal, and keeps the viewChildren count. Its template reads store.search(),
store.categoryEntities(), store.visibleSecrets() and store.secretsLoading(), and calls
store.setSearch, store.setCategoryFilter and store.openSecretById.

SecretForm drops its HttpClient and calls store.saveSecret instead.
```

Expected Outcome: `git diff --stat` on `src/app` shows lines leaving the components. The screen
behaves as before: selecting Team Documents shows its files and the upload bar, searching narrows
them, and the count line reports both numbers:

```text
1 of 1 secrets shown
```

---

## Step 5: Test the store without a component

Overview: a store that needs a fixture to test is still coupled to the view. `TestBed.inject`
plus the HTTP testing controller is enough, and the test reads like the feature's contract.

Recipe:

```text
Write src/app/store/secrets-store.spec.ts. Configure TestBed with provideHttpClient and
provideHttpClientTesting, inject SecretsStore, flush /api/lists with two rows, one of type 1 and
one of type 2, and assert that secretsLists and vaultLists split them, that selectedListId is the
first list's id, and that selectedList resolves to that row.

Do not create a component fixture.
```

Expected Outcome: `npx ng test --watch=false` runs green and the store spec needs no fixture:

```text
Test Files  4 passed (4)
Tests       6 passed (6)
```

---

## Next

Lab 7 gives the workbench a real route table, so the selected list and the open secret live in the
URL rather than in the store alone, with resolvers, guards and an interceptor around them.
