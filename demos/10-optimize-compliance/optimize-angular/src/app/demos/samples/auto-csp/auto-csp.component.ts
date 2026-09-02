import { Component, DestroyRef, computed, inject, signal } from '@angular/core';

interface ViolationLog {
  directive: string;
  blocked: string;
  at: string;
}

@Component({
  selector: 'app-auto-csp',
  templateUrl: './auto-csp.component.html',
  styleUrls: ['./auto-csp.component.scss'],
  imports: []
})
export class AutoCspComponent {
  private destroyRef = inject(DestroyRef);

  readonly policy = signal(this.readPolicy());
  readonly violations = signal<ViolationLog[]>([]);
  readonly trustedTypes = signal(typeof window !== 'undefined' && 'trustedTypes' in window);
  readonly evalBlocked = signal<boolean | null>(null);

  readonly active = computed(() => this.policy().length > 0);

  readonly directives = [
    { name: "script-src 'strict-dynamic'", why: 'Only scripts whose hash is in the policy may run, plus anything they load themselves.' },
    { name: "object-src 'none'", why: 'Removes the plugin vector that bypasses script restrictions.' },
    { name: "base-uri 'self'", why: 'Stops an injected <base> tag from redirecting every relative script URL.' },
    { name: "require-trusted-types-for 'script'", why: 'Turns raw string assignment to innerHTML into a runtime error.' }
  ];

  constructor() {
    const onViolation = (event: SecurityPolicyViolationEvent) => {
      this.violations.update(list => [
        { directive: event.violatedDirective, blocked: event.blockedURI || 'inline', at: new Date().toLocaleTimeString() },
        ...list
      ].slice(0, 10));
    };

    document.addEventListener('securitypolicyviolation', onViolation);
    this.destroyRef.onDestroy(() => document.removeEventListener('securitypolicyviolation', onViolation));
  }

  probeEval() {
    try {
      const run = new Function('return 1 + 1');
      this.evalBlocked.set(run() !== 2);
    } catch {
      this.evalBlocked.set(true);
    }
  }

  private readPolicy(): string {
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return meta?.getAttribute('content') ?? '';
  }
}
