import { DOCUMENT, Component, computed, inject, signal } from '@angular/core';

type VendorKey = 'analytics' | 'chat' | 'heatmap';

interface Vendor {
  key: VendorKey;
  name: string;
  src: string;
  purpose: string;
  lawfulBasis: string;
  personalData: string;
  storage: string;
  global: string;
}

interface Evidence {
  file: string;
  transferred: number;
  at: number;
}

const STORAGE_KEY = 'demo-script-consent';

@Component({
  selector: 'app-consent-gated-scripts',
  templateUrl: './consent-gated-scripts.component.html',
  styleUrls: ['./consent-gated-scripts.component.scss'],
  imports: []
})
export class ConsentGatedScriptsComponent {
  private document = inject(DOCUMENT);

  readonly vendors: Vendor[] = [
    {
      key: 'analytics',
      name: 'Product analytics',
      src: '/vendor/analytics-stub.js',
      purpose: 'Page views and funnel steps.',
      lawfulBasis: 'Consent, Art. 6(1)(a) GDPR',
      personalData: 'IP address, user agent, referrer',
      storage: 'window.demoAnalytics',
      global: 'demoAnalytics'
    },
    {
      key: 'chat',
      name: 'Support chat widget',
      src: '/vendor/chat-widget-stub.js',
      purpose: 'Live support conversation.',
      lawfulBasis: 'Consent, Art. 6(1)(a) GDPR',
      personalData: 'IP address, message content, a session cookie',
      storage: 'cookie demo_chat_sid',
      global: 'demoChatWidget'
    },
    {
      key: 'heatmap',
      name: 'Session heatmap',
      src: '/vendor/heatmap-stub.js',
      purpose: 'Click and scroll recording.',
      lawfulBasis: 'Consent, Art. 6(1)(a) GDPR',
      personalData: 'Pointer coordinates, viewport, IP address',
      storage: 'a document-level pointerdown listener',
      global: 'demoHeatmap'
    }
  ];

  readonly granted = signal<Record<VendorKey, boolean>>(this.restore());
  readonly loaded = signal<Record<VendorKey, boolean>>({ analytics: false, chat: false, heatmap: false });
  readonly evidence = signal<Evidence[]>([]);
  readonly log = signal<string[]>([]);
  readonly needsReload = signal(false);

  readonly anyGranted = computed(() => Object.values(this.granted()).some(Boolean));
  readonly loadedCount = computed(() => Object.values(this.loaded()).filter(Boolean).length);

  constructor() {
    const stored = this.granted();
    for (const vendor of this.vendors) {
      if (stored[vendor.key]) {
        this.write(`${vendor.name}: consent found in the stored record, replaying the injection`);
        this.inject(vendor);
      }
    }
  }

  grant(vendor: Vendor) {
    if (this.granted()[vendor.key]) {
      return;
    }
    this.granted.update(state => ({ ...state, [vendor.key]: true }));
    this.persist();
    this.inject(vendor);
  }

  deny(vendor: Vendor) {
    this.granted.update(state => ({ ...state, [vendor.key]: false }));
    this.persist();

    const tag = this.document.getElementById(`vendor-${vendor.key}`);
    tag?.remove();
    this.loaded.update(state => ({ ...state, [vendor.key]: false }));

    if (vendor.key === 'chat') {
      this.document.cookie = 'demo_chat_sid=; path=/; Max-Age=0; SameSite=Lax';
    }

    this.needsReload.set(true);
    this.write(`${vendor.name}: tag removed and storage cleared, but code already executed stays in memory`);
  }

  withdrawAll() {
    for (const vendor of this.vendors) {
      this.deny(vendor);
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      this.write('consent record could not be removed from localStorage');
    }
    this.write('all consent withdrawn, reload the page to drop the loaded vendor code');
  }

  reload() {
    location.reload();
  }

  isPresent(vendor: Vendor): boolean {
    return this.loaded()[vendor.key];
  }

  private inject(vendor: Vendor) {
    const start = performance.now();
    const script = this.document.createElement('script');
    script.id = `vendor-${vendor.key}`;
    script.src = vendor.src;
    script.async = true;

    script.onload = () => {
      this.loaded.update(state => ({ ...state, [vendor.key]: true }));
      this.write(`${vendor.name}: script executed after consent, ${Math.round(performance.now() - start)} ms`);
      this.collect(vendor);
    };

    script.onerror = () => {
      this.write(`${vendor.name}: script failed to load from ${vendor.src}`);
    };

    this.document.head.appendChild(script);
    this.write(`${vendor.name}: consent recorded, script tag appended`);
  }

  private collect(vendor: Vendor) {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const match = entries.filter(entry => entry.name.includes(vendor.src)).pop();
    if (!match) {
      return;
    }
    this.evidence.update(list => [
      ...list,
      { file: vendor.src, transferred: match.transferSize, at: Math.round(match.startTime) }
    ]);
  }

  private write(message: string) {
    this.log.update(list => [`${new Date().toLocaleTimeString()} ${message}`, ...list].slice(0, 8));
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.granted()));
    } catch {
      this.write('consent record could not be written to localStorage');
    }
  }

  private restore(): Record<VendorKey, boolean> {
    const fallback: Record<VendorKey, boolean> = { analytics: false, chat: false, heatmap: false };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...fallback, ...JSON.parse(raw) as Partial<Record<VendorKey, boolean>> } : fallback;
    } catch {
      return fallback;
    }
  }
}
