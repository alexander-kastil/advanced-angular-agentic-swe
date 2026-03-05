import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Skill } from './skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {

  http = inject(HttpClient);
  private url = `${environment.api}skills`;

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.url);
  }

  getSkill(id: number): Observable<Skill | undefined> {
    return this.http.get<Skill>(`${this.url}/${id}`)
  }

  addSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(this.url, skill);
  }

  deleteSkill(skill: Skill): Observable<any> {
    return this.http.delete(this.url);
  }
}
