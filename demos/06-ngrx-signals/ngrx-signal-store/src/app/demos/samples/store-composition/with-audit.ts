import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

export type AuditState = {
  auditLog: string[];
};

export function withAudit(source: () => string, limit = 12) {
  return signalStoreFeature(
    withState<AuditState>({ auditLog: [] }),
    withMethods((store) => ({
      audit(message: string) {
        patchState(store, { auditLog: [`[${source()}] ${message}`, ...store.auditLog()].slice(0, limit) });
      },
      clearAudit() {
        patchState(store, { auditLog: [] });
      },
    }))
  );
}
