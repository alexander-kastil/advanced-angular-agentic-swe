import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "ux-button",
  templateUrl: "./ux-button.component.html",
  styleUrls: ["./ux-button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButton, MatIcon]
})
export class uxButtonComponent {
  @Input() disabled: boolean = false;
  @Input() label: string = "";
  @Input() icon: string = "";
  @Output() click: EventEmitter<any> = new EventEmitter<any>();

  buttonClicked() {
    this.click.emit(null);
  }
}
