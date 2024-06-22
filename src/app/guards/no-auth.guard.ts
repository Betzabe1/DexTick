import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { UtilService } from '../services/util.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  firebaseSvc = inject(UserService);
  utilSvc = inject(UtilService);
  router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve) => {
      this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        if (!auth) {
          resolve(true);
        } else {
          // Si está autenticado, redirigir a la página correspondiente según su rol
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user.role === 'client') {
            resolve(this.router.createUrlTree(['/tabs/home-user']));
          } else if (user.role === 'agent') {
            resolve(this.router.createUrlTree(['/tabs-agent/home-agent']));
          } else if (user.role === 'admin') {
            resolve(this.router.createUrlTree(['/tabs-admin/home-admin']));
          } else {
            resolve(this.router.createUrlTree(['/login']));
          }
        }
      });
    });
  }
}
