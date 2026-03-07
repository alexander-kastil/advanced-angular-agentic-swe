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