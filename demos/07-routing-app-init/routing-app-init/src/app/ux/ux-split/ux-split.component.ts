import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialogTitle } from "@angular/material/dialog";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";

@Component({
  selector: "ux-split",
  templateUrl: "./ux-split.component.html",
  styleUrls: ["./ux-split.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbar, MatDialogTitle, MatToolbarRow]
})
export class uxSplitComponent {
  toolbar = "100px";
}
