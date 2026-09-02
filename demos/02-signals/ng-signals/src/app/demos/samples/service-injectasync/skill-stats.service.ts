import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Skill } from '../../../skills/skill.model';

@Service()
export class SkillStatsService {
  private http = inject(HttpClient);

  async summarize() {
    const skills = await firstValueFrom(this.http.get<Skill[]>(`${environment.api}skills`));
    const done = skills.filter((s) => s.completed).length;
    return `${done} of ${skills.length} skills completed`;
  }
}
