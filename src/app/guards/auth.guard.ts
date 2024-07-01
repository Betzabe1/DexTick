import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const expectedRole = route.data['expectedRole'];
    console.log('Expected Role:', expectedRole);

    return this.afAuth.authState.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          console.log('Authenticated user:', user);

          return from(this.userService.getDocument(`users/${user.uid}`)).pipe(
            map(doc => {
              const userRole = doc?.['role'];
              console.log('User role:', userRole);

              if (userRole === expectedRole) {
                return true;
              } else {
                // Redirigir a una página de acceso denegado si el rol no coincide
                return this.router.parseUrl('/login');
              }
            }),
            // En caso de error al obtener el documento, redirigir al login
            switchMap(result => result instanceof UrlTree ? of(result) : of(result)),
            take(1)
          );
        } else {
          // Redirigir a la página de inicio de sesión si no está autenticado
          return of(this.router.parseUrl('/login'));
        }
      })
    );
  }
}
