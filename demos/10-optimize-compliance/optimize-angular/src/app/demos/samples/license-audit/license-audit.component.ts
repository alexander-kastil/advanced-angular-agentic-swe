import { Component, computed, signal } from '@angular/core';

interface Dependency {
  name: string;
  license: string;
  category: 'permissive' | 'weak-copyleft' | 'copyleft' | 'review';
  obligation: string;
}

@Component({
  selector: 'app-license-audit',
  templateUrl: './license-audit.component.html',
  styleUrls: ['./license-audit.component.scss'],
  imports: []
})
export class LicenseAuditComponent {
  readonly dependencies: Dependency[] = [
    { name: '@angular/core', license: 'MIT', category: 'permissive', obligation: 'Ship the license text and the copyright notice.' },
    { name: '@angular/aria', license: 'MIT', category: 'permissive', obligation: 'Ship the license text and the copyright notice.' },
    { name: 'rxjs', license: 'Apache-2.0', category: 'permissive', obligation: 'Ship the license, the NOTICE file and a statement of changes.' },
    { name: 'axe-core', license: 'MPL-2.0', category: 'weak-copyleft', obligation: 'Modified source files of the library itself must stay under MPL-2.0.' },
    { name: 'marked', license: 'MIT', category: 'permissive', obligation: 'Ship the license text and the copyright notice.' },
    { name: 'prismjs', license: 'MIT', category: 'permissive', obligation: 'Ship the license text and the copyright notice.' },
    { name: 'moment', license: 'MIT', category: 'permissive', obligation: 'Ship the license text. Deprecated upstream, plan a replacement.' }
  ];

  readonly filter = signal<'all' | Dependency['category']>('all');

  readonly visible = computed(() => {
    const active = this.filter();
    return active === 'all' ? this.dependencies : this.dependencies.filter(dep => dep.category === active);
  });

  readonly counts = computed(() => {
    const summary = new Map<string, number>();
    for (const dep of this.dependencies) {
      summary.set(dep.category, (summary.get(dep.category) ?? 0) + 1);
    }
    return [...summary.entries()].map(([category, count]) => ({ category, count }));
  });

  setFilter(value: 'all' | Dependency['category']) {
    this.filter.set(value);
  }
}
