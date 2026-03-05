import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { SideNavService } from "src/app/shared/sidenav/sidenav.service";

@Component({
  selector: "app-admin-container",
  templateUrl: "./admin-container.component.html",
  styleUrls: ["./admin-container.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminContainerComponent implements OnInit {
  constructor(public ms: SideNavService) { }

  links: { title: string; url: string }[] = [
    { title: "Topics", url: "topics" },
    { title: "Skills", url: "skills" }
  ];

  ngOnInit() { }

  getWorbenchStyle() {
    let result = {};
    this.ms.visible$.subscribe(visible => {
      result = visible
        ? {
          "margin-left": "10px"
        }
        : {};
    });
    return result;
  }
}
