import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-subject-to-output',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton],
  templateUrl: './subject-to-output.component.html',
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .log-entry { font-size: 0.85rem; padding: 4px 0; border-bottom: 1px solid #eee; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectToOutputComponent {
  private event$ = new Subject<string>();

  protected subjectLog = signal<string[]>([]);
  protected outputLog = signal<string[]>([]);

  protected emitViaSubject() {
    const msg = `Subject @ ${new Date().toLocaleTimeString()}`;
    this.event$.next(msg);
    this.subjectLog.update(log => [msg, ...log.slice(0, 4)]);
  }

  protected emitViaOutput() {
    const msg = `output() @ ${new Date().toLocaleTimeString()}`;
    this.outputLog.update(log => [msg, ...log.slice(0, 4)]);
  }

  readonly clicked = output<string>();
}
