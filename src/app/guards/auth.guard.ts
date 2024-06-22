import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { UtilService } from '../services/util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseSvc = inject(UserService);
  utilSvc = inject(UtilService);
  router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve) => {
      this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        if (auth) {
          const user = localStorage.getItem('user');
          if (user) {
            resolve(true);
          } else {
            // Usuario autenticado pero no encontrado en localStorage
            resolve(this.router.createUrlTree(['/login']));
          }
        } else {
          // No autenticado
          resolve(this.router.createUrlTree(['/login']));
        }
      });
    });
  }
}
