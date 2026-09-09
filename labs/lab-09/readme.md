# Expose the Workbench as Agent Tools

The agent has been writing the workbench for nine labs and cannot use it. WebMCP changes that: a
page can declare tools an agent calls directly, so the store, the router and the form become an
interface rather than a screen to scrape. The interesting decision is not which tools to expose
but which ones to refuse, and in a credential manager that list is short and non-negotiable.

------

Work in [`l09-secrets-vault-starter/`](./l09-secrets-vault-starter/). Run `claude` from the
repository root and `npm` commands in the app folder. The finished result is in
[`l09-secrets-vault-solution/`](./l09-secrets-vault-solution/).

```bash
cd labs/lab-09/l09-secrets-vault-starter
npm install
npm start
```

---

## Step 1: Decide what the agent may not have

Overview: every tool is a capability handed to something that is not the user and cannot be
watched. Writing the refusal list first stops the exposure from being decided one convenient tool
at a time.

Research:

```text
The workbench can list secret lists, search secrets, open a secret, reveal its value, copy it,
export every secret as CSV, edit a secret through a Signal Form, upload a vault file and delete a
secret. I am about to expose some of these as WebMCP tools an agent can call without the user
clicking anything.

Go through them one at a time. For each, say what an agent could do with it that the user did not
ask for, and whether the damage is visible on screen while it happens. Then give me the tools you
would expose, the ones you would refuse outright, and the ones you would expose only as a
proposal the user still has to confirm.
```

Finding: the answer should refuse reveal, copy, export and delete, and it should give the same
reason for all four: each moves a credential out of the user's sight, and none of them leaves a
trace on screen that the user would notice. Search and open are safe because they return names
and metadata, not values. Editing belongs in the third group: the agent may type into the form,
but Save stays a human action. Reject any answer that exposes export because it is read-only:
read-only is not the property that matters here.

Recipe:

```text
Create src/app/agent/workbench-tools.ts exporting a workbenchTools array of WebMCP tool
descriptors and a provideWorkbenchTools() function wrapping it in
provideExperimentalWebMcpTools. Each descriptor has a name, a description written for an agent to
read, an inputSchema as JSON Schema with additionalProperties false, and an execute that reads
its arguments out of the args record.

Start with two tools. list_secret_lists injects SecretsStore and returns the lists as id, name,
kind and secretCount, with type 2 rendered as Vault. describe_withheld_tools returns the refusal
list from step 1 with its reason, so an agent that asks what it cannot do gets a straight answer
rather than guessing.

Register provideWorkbenchTools() in app.config.ts.
```

Expected Outcome: the app starts with no console error and the tool list is a plain array the
tests can call:

```text
list_secret_lists  ->  [{"listId":"l1","name":"Cloud Provider Keys","kind":"Secrets","secretCount":1}, ...]
```

---

## Step 2: Give the agent the router

Overview: a tool that changes what the agent knows without changing what the user sees is a
divergence waiting to confuse both. Navigating through the real router keeps the screen and the
conversation on the same secret.

Recipe:

```text
Add an open_list tool taking a listId string. It injects Router and navigates to
/secrets/<listId>, then returns a one-line confirmation. Because the route drives the store, this
one call selects the list, loads its secrets and its categories and updates the address bar.
```

Expected Outcome: calling the tool moves the workbench, and the address bar proves it rather than
the return value:

```text
open_list { listId: 'a9794369-...' }  ->  /secrets/a9794369-...  with the Vault upload bar visible
```

---

## Step 3: Search and open without returning a value

Overview: the two tools an agent actually needs are also the two where a careless implementation
leaks the thing the app exists to protect. The rule is mechanical: return names and metadata,
never `comment` and never `password`.

Recipe:

```text
Add a search_secrets tool taking a term string. It sets the store's search, awaits loadSecrets,
and returns only the names of the visible secrets.

Add an open_secret tool taking a name string. It finds that secret among the loaded entities,
navigates to /secrets/<listId>/<secretId>, and returns name, user, url, mfa, version and
categoryIds as JSON. It returns a plain sentence when no secret matches. Neither tool returns
comment or password.
```

Expected Outcome: the search returns a list of names and the open returns metadata, and neither
string contains the value:

```text
search_secrets { term: 'hetzner' }        ->  ["hetzner-api-token"]
open_secret   { name: 'hetzner-api-token' } ->  {"name":"hetzner-api-token","user":"ops","mfa":true,"version":3,...}
```

---

## Step 4: Let the agent propose, not commit

Overview: the form is the one place where an agent is genuinely useful and genuinely dangerous.
`declareExperimentalWebMcpTool` registers a tool for the lifetime of an injection context, which
is the right scope for something that only makes sense while a secret is open.

Recipe:

```text
Add a declareRenameTool(injector) function that calls declareExperimentalWebMcpTool inside
runInInjectionContext for a propose_secret_rename tool taking a newName string. It reads the
store's open secret, returns a sentence saying nothing is open when there is none, and otherwise
returns a sentence naming the proposed change and stating that the user still has to press Save.

Its description must say that the agent never saves. The tool unregisters itself when the
injector that owns it is destroyed, so it exists only while a secret is open.
```

Expected Outcome: the tool answers with a proposal rather than a result, and its own description
tells the agent where the boundary is:

```text
propose_secret_rename { newName: 'hetzner-token' }
  ->  Proposed renaming hetzner-api-token to hetzner-token. The user still has to press Save.
```

---

## Step 5: Find out whether the browser has the surface at all

Overview: `provideExperimentalWebMcpTools` registers against `document.modelContext`, falling back
to `navigator.modelContext`. Both are behind an origin trial, so on a page without a token neither
exists and every registration is a silent no-op. A page that ships tools has to know which it is.

Recipe:

```text
Create src/app/agent/webmcp-availability.ts exporting a modelContext() function that reads
document.modelContext, falls back to navigator.modelContext, and returns null unless the result
has a registerTool function. Comment why the surface can be absent.

Add an empty origin-trial meta tag to src/index.html with a comment saying a token for this
origin makes document.modelContext appear.

Then add public/webmcp.json: a static manifest naming the product, the tools with what each
returns, and a withheld array holding the four capabilities from step 1. An agent that reads it
learns the shape without calling anything, and a crawler learns it without running JavaScript.
```

Expected Outcome: the manifest is served at `/webmcp.json`, and the availability check reports
the truth about the running browser:

```text
document.modelContext   undefined
navigator.modelContext  undefined
modelContext()          null
```

That is the expected answer in a stock Chrome 152: the tools are registered by Angular, the
browser drops them, and nothing errors. Pasting a valid origin-trial token into the meta tag is
what turns the same build into a page an agent can drive.

---

## Step 6: Test the tools as an agent would call them

Overview: a tool is an API, and the assertion that matters is not that it returned something but
that it did not return the value. That is a test you can write once and keep forever.

Recipe:

```text
Write src/app/agent/workbench-tools.spec.ts. Seed the store through the HTTP testing controller
with two lists and one secret whose password and comment carry recognisable strings. Run each
tool by finding it in workbenchTools and calling execute inside runInInjectionContext with the
EnvironmentInjector.

Assert four things: list_secret_lists returns exactly the id, name, kind and count; search_secrets
returns the names and the response string does not contain the password; open_secret returns the
metadata and the response contains neither the password nor the comment; and workbenchTools
contains no tool named reveal_secret, export_secrets or delete_secret.

Give provideRouter a two-route table for secrets/:listId and secrets/:listId/:secretId, because
open_secret navigates and an empty table throws NG04002. Add a fifth case asserting that
modelContext() returns null, so the suite records which browser it ran in.
```

Expected Outcome: twenty-one specs green across the suite, with the tool specs asserting absence
as well as presence:

```text
exposes the lists without leaking anything else
returns names from a search, never values
returns metadata but no value when opening a secret
reports the browser surface as absent without the origin trial
exposes no tool that reveals, exports or deletes
```

The agent connection itself is not executed here: it needs an origin-trial token and a browser
agent. The tools are exercised through their `execute` functions instead, which is the same code
path `registerTool` invokes.

---

## Next

Lab 10 measures what nine labs of features cost: Lighthouse, a bundle budget that fails the
build, virtual scrolling over a long list, and a WCAG 2.2 AA pass over the controls built in
lab 3.
