import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  signUp(user: any): Observable<any> {
    return this.http.post(`${this.URL}/signup`, user);
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.URL}/signin`, { email, password });
  }

  signOut(): void {
    // Remover el token del almacenamiento local
    localStorage.removeItem('token');
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
