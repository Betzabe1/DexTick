import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private utilSvc: UtilService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    const expectedRole = route.data['expectedRole'];
    const user = this.utilSvc.getFromLocalStorage('user');

    if (user && user.role === expectedRole) {
      return true;
    } else {
      // Redirigir al usuario a una página de acceso denegado o a la página de inicio
      this.router.navigate(['/login']);
      return false;
    }
  }
}
