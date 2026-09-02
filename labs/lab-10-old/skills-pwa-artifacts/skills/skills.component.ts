import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Skill } from './skill.model';
import { SkillsService } from './skills.service';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-skills',
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgFor,
        AsyncPipe,
    ],
})
export class SkillsComponent implements OnInit {
  skills$: BehaviorSubject<Skill[]> = new BehaviorSubject<Skill[]>([]);
  skillToAdd = new FormControl<string>('', { nonNullable: true });

  constructor(private service: SkillsService) {}

  ngOnInit(): void {
    this.service.getSkills().subscribe((skills) => {
      this.skills$.next(skills);
    });
  }

  removeSkill(s: Skill) {
    const skills = this.skills$.getValue().filter((i: Skill) => i !== s);
    this.skills$.next(skills);
  }

  addSkill() {
    const skills = this.skills$.getValue();
    skills.push({ id: skills.length + 1, name: this.skillToAdd.value });
    this.skills$.next(skills);
    this.skillToAdd.setValue('');
  }
}
