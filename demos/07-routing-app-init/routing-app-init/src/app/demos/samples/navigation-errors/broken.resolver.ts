import { ResolveFn } from '@angular/router';

export const brokenResolver: ResolveFn<never> = (route) => {
  throw new Error(`Resolver failed for segment "${route.routeConfig?.path}"`);
};
