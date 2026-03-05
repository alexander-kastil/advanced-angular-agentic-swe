import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Skill } from './skill.model';

@Injectable()
export class SkillsDataService extends DefaultDataService<Skill> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Skill', http, httpUrlGenerator);
  }

  // Because we have overwritten all CRUD methods, we do not need to proide a custom HttpUrlGenerator
  // The current overwrites are just for demonstration purposes that represent the default behaviour

  override getAll() {
    return this.http.get<Skill[]>(`${environment.api}skills`).pipe(
      map((data: Skill[]) => {
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
    return this.http.post<Skill>(`${environment.api}skills`, skill).pipe(
      map((data) => {
        return { ...skill, id: data.id };
      })
    );
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
