import { Component, computed, effect, signal } from '@angular/core';

type CategoryKey = 'necessary' | 'analytics' | 'media';

interface Category {
  key: CategoryKey;
  label: string;
  purpose: string;
  lawfulBasis: string;
  locked: boolean;
}

const STORAGE_KEY = 'demo-consent';

@Component({
  selector: 'app-consent-privacy',
  templateUrl: './consent-privacy.component.html',
  styleUrls: ['./consent-privacy.component.scss'],
  imports: []
})
export class ConsentPrivacyComponent {
  readonly categories: Category[] = [
    { key: 'necessary', label: 'Strictly necessary', purpose: 'Session handling and the consent record itself.', lawfulBasis: 'Legitimate interest, no consent required', locked: true },
    { key: 'analytics', label: 'Analytics', purpose: 'Page views and Core Web Vitals sent to a third party.', lawfulBasis: 'Consent, Art. 6(1)(a) GDPR', locked: false },
    { key: 'media', label: 'External media', purpose: 'Video players that set cookies and read the IP address.', lawfulBasis: 'Consent, Art. 6(1)(a) GDPR', locked: false }
  ];

  readonly granted = signal<Record<CategoryKey, boolean>>(this.restore());
  readonly decided = signal(this.hasRecord());

  readonly mediaAllowed = computed(() => this.granted().media);
  readonly analyticsAllowed = computed(() => this.granted().analytics);
  readonly beacons = signal<string[]>([]);

  constructor() {
    effect(() => {
      const state = this.granted();
      if (this.decided()) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
          return;
        }
      }
    });

    effect(() => {
      if (this.analyticsAllowed()) {
        this.beacons.update(list => [`pageview sent at ${new Date().toLocaleTimeString()}`, ...list].slice(0, 5));
      }
    });
  }

  toggle(key: CategoryKey) {
    this.granted.update(state => ({ ...state, [key]: !state[key] }));
  }

  acceptAll() {
    this.granted.set({ necessary: true, analytics: true, media: true });
    this.decided.set(true);
  }

  rejectOptional() {
    this.granted.set({ necessary: true, analytics: false, media: false });
    this.decided.set(true);
  }

  save() {
    this.decided.set(true);
  }

  withdraw() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      return;
    }
    this.granted.set({ necessary: true, analytics: false, media: false });
    this.decided.set(false);
    this.beacons.set([]);
  }

  private restore(): Record<CategoryKey, boolean> {
    const fallback: Record<CategoryKey, boolean> = { necessary: true, analytics: false, media: false };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...fallback, ...JSON.parse(raw) as Partial<Record<CategoryKey, boolean>> } : fallback;
    } catch {
      return fallback;
    }
  }

  private hasRecord(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }
}
