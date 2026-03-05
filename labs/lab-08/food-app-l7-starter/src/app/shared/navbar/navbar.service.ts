import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NavItem } from "./nav-item.model";

@Injectable({
  providedIn: "root",
})
export class NavbarService {
  constructor(private httpClient: HttpClient) {}

  getItems() {
    return this.httpClient.get<NavItem[]>("assets/menu-items.json");
  }
}
