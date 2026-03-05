import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "app-unit-testing",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./unit-testing.component.html",
    styleUrls: ["./unit-testing.component.scss"],
    imports: []
})
export class UnitTestingComponent { }
