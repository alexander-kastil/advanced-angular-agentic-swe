
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Skill } from './skills.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  @Input() skills: Skill[] = [];
  @Output() skillsSaved: EventEmitter<Skill[]> = new EventEmitter<Skill[]>();
  skillToAdd = '';

  removeSkill(item: Skill): void {
    this.skills = this.skills.filter((s) => s.id !== item.id);
  }

  addSkill(): void {
    const sk: Skill = {
      id: this.skills.length + 1,
      name: this.skillToAdd,
      hours: 4,
      completed: false,
    };
    this.skills.push(sk);
  }

  saveSkills(): void {
    this.skillsSaved.emit(this.skills);
  }
}