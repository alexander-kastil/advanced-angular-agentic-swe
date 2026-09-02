import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Skill } from './skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private http = inject(HttpClient);
  private url = `${environment.api}skills`;

  readonly skills = httpResource<Skill[]>(() => this.url, { defaultValue: [] });

  readonly total = computed(() => this.skills.value().length);
  readonly openCount = computed(() => this.skills.value().filter((s) => !s.completed).length);

  async add(skill: Skill) {
    await firstValueFrom(this.http.post<Skill>(this.url, skill));
    this.skills.reload();
  }

  async update(skill: Skill) {
    await firstValueFrom(this.http.put<Skill>(`${this.url}/${skill.id}`, skill));
    this.skills.reload();
  }

  async remove(skill: Skill) {
    await firstValueFrom(this.http.delete(`${this.url}/${skill.id}`));
    this.skills.reload();
  }
}
