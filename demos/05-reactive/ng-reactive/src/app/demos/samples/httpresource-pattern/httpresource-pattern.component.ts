import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Skill } from '../../skills/skills';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-httpresource-pattern',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatChipSet, MatChip, MatProgressBar],
  templateUrl: './httpresource-pattern.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpresourcePatternComponent {
  protected skillsResource = httpResource<Skill[]>(() => `${environment.api}skills`);
}
