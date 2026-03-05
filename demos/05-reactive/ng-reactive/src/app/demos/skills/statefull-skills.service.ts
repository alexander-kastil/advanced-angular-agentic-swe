import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Skill } from "./skills";
import { SkillsService } from "./skills.service";

@Injectable({
  providedIn: "root"
})
export class SkillsState {
  constructor(private service: SkillsService) {
    this.initData();
  }

  private arrSkills: Skill[] = [];
  private skills: BehaviorSubject<Skill[]> = new BehaviorSubject(
    this.arrSkills
  );

  private initData() {
    this.service.getSkills().subscribe(data => {
      this.arrSkills = data;
      this.skills.next(this.arrSkills);
    });
  }

  getAllSkills(): Observable<Skill[]> {
    return this.skills;
  }

  getSkill(id: number): Observable<Skill> {
    return this.skills.pipe(map(m => m.find(mi => mi.id == id)));
  }

  insertSkill(s: Skill): Observable<Skill> {
    return this.service.insertSkill(s);
  }

  updateSkill(s: Skill): Observable<void> {
    return this.service.updateSkill(s);
  }

  deleteSkill(s: Skill): Observable<void> {
    return this.service.deleteSkill(s.id);
  }
}
