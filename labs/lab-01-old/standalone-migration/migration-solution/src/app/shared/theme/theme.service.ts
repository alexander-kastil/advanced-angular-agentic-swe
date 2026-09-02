import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  private theme: string = "default";
  private currTheme: BehaviorSubject<string> = new BehaviorSubject(this.theme);

  toggleTheme() {
    this.theme = this.theme == "default" ? "dark" : "default";
    console.log("curr theme:", this.theme);
    this.currTheme.next(this.theme);
  }

  getTheme(): Observable<string> {
    return this.currTheme;
  }
}
