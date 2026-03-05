import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { BoxedDirective, ClickableDirective } from '../../../shared/formatting/formatting-directives';
import { Skill } from '../../../skills/skill.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-zoneless-change-detection',
  imports: [BoxedDirective, ClickableDirective],
  templateUrl: './zoneless-change-detection.component.html',
  styleUrl: './zoneless-change-detection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZonelessChangeDetectionComponent implements OnInit {
  counter = 0;
  tick = 0;
  stick = signal(0);

  skillsResource = httpResource<Skill[]>(() => `${environment.api}skills`);
  skills = computed(() => (this.skillsResource.value() ?? []).slice(0, 2));

  ngOnInit() {
    setInterval(() => {
      this.tick += 1;
    }, 1000);
  }

  incrementCounter() {
    this.counter += 1;
  }
}
