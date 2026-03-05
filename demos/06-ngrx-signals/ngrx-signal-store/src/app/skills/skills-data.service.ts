import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Skill } from './skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillsDataService extends DefaultDataService<Skill> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Skill', http, httpUrlGenerator);
    console.log('SkillsDataService instantiated');
  }

  // Because we have overwritten all CRUD methods, we do not need to provide a custom HttpUrlGenerator
  // The current overwrites are just for demonstration purposes that represent the default behaviour

  override getAll() {
    console.log('[SkillsDataService.getAll] called');
    return this.http.get<Skill[]>(`${environment.api}skills`).pipe(
      map((data: Skill[]) => {
        console.log('[SkillsDataService.getAll] response:', data);
        if (!data) {
          return [];
        }
        return (data as Skill[]).map((sk) => {
          return { ...sk };
        });
      })
    );
  }

  override add(skill: Skill): Observable<Skill> {
    const { id: _id, ...payload } = skill;
    return this.http.post<Skill>(`${environment.api}skills`, payload);
  }

  override update(skill: Update<Skill>): Observable<Skill> {
    return this.http.put<Skill>(`${environment.api}skills/${skill.id}`, {
      ...skill.changes,
    });
  }

  override delete(id: string): Observable<string> {
    return this.http.delete(`${environment.api}skills/${id}`).pipe(
      map((data) => {
        return id;
      })
    );
  }
}
