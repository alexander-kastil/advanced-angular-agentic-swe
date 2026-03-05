import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TopicsComponent } from "./topics/topics.component";
import { SkillsComponent } from "./skills/skills.component";
import { Routes, RouterModule } from "@angular/router";
import { AdminContainerComponent } from "./admin-container/admin-container.component";
import { MaterialModule } from "../material.module";
import { DemosAdminComponent } from "./demos-admin/demos-admin.component";

const adminRoutes: Routes = [
  {
    path: "",
    component: AdminContainerComponent,

    children: [
      { path: "topics", component: TopicsComponent },
      { path: "skills", component: SkillsComponent },
      { path: "demos", component: DemosAdminComponent }
    ]
  }
];

@NgModule({
  declarations: [
    TopicsComponent,
    SkillsComponent,
    AdminContainerComponent,
    DemosAdminComponent
  ],
  imports: [CommonModule, RouterModule.forChild(adminRoutes), MaterialModule]
})
export class AdminModule {}
