import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  signUp(user: any): Observable<any> {
    return this.http.post(`${this.URL}/signup`, user);
  }

  //metodo para obtener el nombre
  getUser(): Observable<any> {
    return this.http.get(`${this.URL}/user`);
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.URL}/signin`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.accessToken && response.refreshToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      })
    );
  }

  signOut(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      // Manejar el caso en el que no hay refreshToken
      return of(null);
    }

    return this.http.post(`${this.URL}/refresh-token`, {}, {
      headers: { 'refresh-token': refreshToken }
    }).pipe(
      tap((response: any) => {
        if (response && response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
      }),
      catchError(err => {
        // Manejar errores aquí, como redirigir al login si el refreshToken no es válido
        this.signOut();
        return of(null);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
