# Angular Elements

In the lab we will create a simple Angular Element that will be used in a static HTML page. The Angular Element will be a simple list of skills that can be added, removed and saved.

## Getting started:

- Project Setup & Add Elements

  ```
  ng new skills-list --routing=false --style=scss --ssr=false
  cd skills-list
  code .
  npm i -S @angular/elements
  ```

## Implement the component that will be exported as Angular Element

- Add the `FormsModule` to `app.module.ts` and add a Component using:

  ```
  ng g c skills
  ```

- Add a `skills/skill.model.ts` file:

  ```typescript
  export class Skill {
    id = 0;
    name = '';
    hours = 0;
    completed = false;
  }
  ```

- In `skills.component.ts` add an `Skill[]` as `@Input()` and create a Button that triggers the current `Skill[]` as `@Output()`

  ```typescript
  @Input() skills: Skill[] = [];
  @Output() skillsSaved: EventEmitter<Skill[]> = new EventEmitter<Skill[]>();
  skillToAdd = '';
  ```

- In skills.component.html add the following html:

  ```html
  <div class="container">
    <h1 class="centered">Current Skills</h1>
    <div class="addRow">
      <label>Add a Skill:</label><input type="text" [(ngModel)]="skillToAdd" />
      <a (click)="addSkill()">Add Skill</a>
      <a (click)="saveSkills()">Save Skills</a>
    </div>
    <div class="centered">
      @defer (when skills.length > 0) {
      <table>
        <colgroup>
          <col style="width: 10%" />
          <col style="width: 60%" />
          <col style="width: 15%" />
          <col style="width: 15%" />
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Hours</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          @for (s of skills; track s) {
          <tr (click)="removeSkill(s)">
            <td>{{ s.id }}</td>
            <td>{{ s.name }}</td>
            <td>{{ s.hours }}</td>
            <td>{{ s.completed }}</td>
          </tr>
          }
        </tbody>
      </table>
      <h3 class="centered">Hover a skill & click to remove</h3>
      }@placeholder{
      <div>Currently you have no skills</div>
      <div>Click "Add Skill" to add a skill</div>
      }
    </div>
  </div>
  ```  

- Add the following css to skills.component.scss:

  ```css
  .container {
    background-color: lavender;
    padding: 1rem;
  }

  tr {
    cursor: pointer;
  }

  table {
    margin: 0 auto;
    min-width: 50vw;

    tr :hover {
      text-decoration: underline;
    }

    th,
    td {
      text-align: start;
    }
  }

  a {
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  input {
    width: 60%;
  }

  .addRow {
    display: flex;
    justify-content: space-between;
    margin: 1rem auto;
    background: #c3002f;
    color: white;
    padding: 1rem;

    a {
      color: white;
    }
  }

  .centered {
    text-align: center;
    margin: 1.5rem;
  }

  div {
    margin-bottom: 1rem;
  }
  ```  

- Add the following events to `skills-list.component.ts`:

  ```typescript
  removeSkill(item: Skill): void {
    this.skills = this.skills.filter((s) => s.id !== item.id);
  }

  addSkill(): void {
    const sk: Skill = {
      id: this.skills.length + 1,
      name: this.skillToAdd,
      hours: 4,
      completed: false,
    };
    this.skills.push(sk);
  }

  saveSkills(): void {
    this.skillsSaved.emit(this.skills);
  }
  ```

- Run your component. Your result should look somehow like this after you have added some items:

  ![skills](_images/skills.png)

## Build & Package

- Modify `main.ts` to create the CustomElement. Comment the following code - you might need it if you want to develop later on:

  ```typescript
  bootstrapApplication(SkillsComponent, appConfig)
    .catch((err) => console.error(err));
  ```

- Add the following code to `main.ts`:

  ```typescript
  (async () => {
    const app = await createApplication({
      providers: [
        /* your global providers here */
      ],
    });

    const element = createCustomElement(SkillsComponent, {
      injector: app.injector,
    });
    customElements.define('skills-list', element);
  })();
  ```

- Add a script to `package.json` to build the Angular Element and run it:

  ```json
  "build:element": "ng build -c production --output-hashing none"
  ```

  >Note: If your want to have only one javascript file you could run the following command on a windows machine: 
  
  ```powershell
  Get-Content .\dist\skills-list\browser\polyfills.js, .\dist\skills-list\browser\main.js | Set-Content .\dist\skills-list\browser\element.js
  ```

## Test your Web Component created with Angular Elements

- Copy `skills.js` to the output folder. It will use the @Input() and @Output() of the Angular Element

  ```javascript
  document.addEventListener("DOMContentLoaded", function (event) {
    const element = document.getElementsByTagName("skills-list")[0];
    if (element) {
      // pass data
      const data = [
        { id: 1, name: "node.js", hours: 2, completed: false },
        { id: 2, name: "type script", hours: 2, completed: false },
        { id: 3, name: "java script", hours: 1, completed: false },
      ];
      element.skills = data;
      // handle event
      element.addEventListener("skillsSaved", (data) =>
        console.log("Data received from ng-skills:", data.detail)
      );
    }
  });
  ```

  - Modify the HTML in `./dist/skills-list/browser/index.html`:

  ```html
  <!DOCTYPE html>
  <html lang="en" data-critters-container>
    <head>
      <meta charset="utf-8" />
      <title>SkillsList</title>
      <base href="/" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/x-icon" href="favicon.ico" />
      <link rel="stylesheet" href="styles.css" />
    </head>
    <body>
      <skills-list></skills-list>
      <script src="polyfills.js" type="module"></script>
      <script src="main.js" type="module"></script>
      <script src="skills.js"></script>
    </body>
  </html>
  ```

- Install a tool that can serve static pages, ie `angular-http-server`:

  ```bash
  npm i -g angular-http-server
  angular-http-server -p 8080
  ```

- Navigate to: `http://localhost:8080/` and test your element
