import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { AppWideNotesService } from './app-wide-notes.service';
import { RouteScopedNotesService } from './route-scoped-notes.service';

@Component({
  selector: 'app-service-migration',
  templateUrl: './service-migration.component.html',
  styleUrls: ['./service-migration.component.scss'],
  imports: [MarkdownRendererComponent],
})
export class ServiceMigrationComponent {
  private router = inject(Router);

  readonly appWide = inject(AppWideNotesService);
  readonly routeScoped = inject(RouteScopedNotesService);

  private nextNote = signal(1);

  addNote() {
    const note = `note ${this.nextNote()}`;
    this.nextNote.update((value) => value + 1);
    this.appWide.add(note);
    this.routeScoped.add(note);
  }

  leaveAndReturn() {
    this.router.navigate(['/demos/route-titles']).then(() => {
      this.router.navigate(['/demos/service-migration']);
    });
  }
}
