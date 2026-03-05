- One way to use Observables in Angular is to adopt an event-handling-like programming style that does subscribe.
- This means that when subscribing to an Observable, the data is taken out of the stream and assigned to properties or variables that are not Observables.
- The Component rendering is bound to those properties or variables.
- However, this approach has some drawbacks, such as the need for proper unsubscribing to avoid memory leaks and the loss of some benefits of reactive programming.

  ```typescript
  ngOnInit(): void {
    this.service.getSkills().subscribe((skills) => {
      this.skills = skills;
    });
  ```
