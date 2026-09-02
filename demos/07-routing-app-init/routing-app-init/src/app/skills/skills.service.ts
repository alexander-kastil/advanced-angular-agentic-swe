import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Skill } from './skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private http = inject(HttpClient);
  private url = `${environment.api}skills`;

  readonly skillsResource = httpResource<Skill[]>(() => this.url, {
    defaultValue: [],
  });

  readonly skills = computed(() =>
    [...this.skillsResource.value()].sort((a, b) => a.name.localeCompare(b.name))
  );
  readonly total = computed(() => this.skills().length);
  readonly openCount = computed(
    () => this.skills().filter((skill) => !skill.completed).length
  );

  getSkill(id: number) {
    return this.http.get<Skill>(`${this.url}/${id}`);
  }

  async addSkill(skill: Skill) {
    await firstValueFrom(this.http.post<Skill>(this.url, skill));
    this.skillsResource.reload();
  }

  async updateSkill(skill: Skill) {
    await firstValueFrom(this.http.put<Skill>(`${this.url}/${skill.id}`, skill));
    this.skillsResource.reload();
  }

  async deleteSkill(skill: Skill) {
    await firstValueFrom(this.http.delete(`${this.url}/${skill.id}`));
    this.skillsResource.reload();
  }
}
