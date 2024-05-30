import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user), // Mapea el estado de autenticación a un booleano
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['/login']); // Redirige a la página de login si el usuario no está autenticado
        }
      })
    );
  }
}


