import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { FirebaseAuthService } from './firebase-auth.service';

export const firebaseGuard = () => {
  const router = inject(Router);
  const auth = inject(FirebaseAuthService);
  const user = auth.getUser();
  return user.pipe(
    map((user) => {
      if (environment.authEnabled == false || user != null) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
}

// @Injectable({
//   providedIn: 'root',
// })
// export class FirebaseAuthGuard {
//   constructor(private router: Router, private as: FirebaseAuthService) { }

//   user = this.as.getUser();

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | boolean {
//     return this.user.pipe(
//       map((user) => {
//         if (environment.authEnabled == false || user != null) {
//           return true;
//         } else {
//           this.router.navigate(['/']);
//           return false;
//         }
//       })
//     );
//   }

//   canLoad(
//     route: Route,
//     segments: UrlSegment[]
//   ):
//     | boolean
//     | UrlTree
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree> {
//     return this.user.pipe(
//       map((user) => {
//         if (environment.authEnabled == false || user != null) {
//           return true;
//         } else {
//           this.router.navigate(['/']);
//           return false;
//         }
//       })
//     );
//   }
// }
