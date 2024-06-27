// auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) {}

  async login(email: string, password: string) {
    const result = await this.afAuth.signInWithEmailAndPassword(email, password);
    this.redirectUser(result.user.uid);
  }

  async register(email: string, password: string, role: 'client' | 'agent' | 'admin') {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.firestore.collection('users').doc(result.user.uid).set({
        uid: result.user.uid,
        email: result.user.email,
        role: role // Asegúrate de almacenar correctamente el rol en Firestore
      });
      this.redirectUser(result.user.uid); // Redirige al usuario después de registrar correctamente
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error; // Puedes manejar el error como prefieras en tu aplicación
    }
  }

  private async redirectUser(uid: string) {
    const userRef = this.firestore.collection('users').doc(uid);
    const userDoc = await userRef.get().toPromise();
    const userData = userDoc.data() as User; // Usa la interfaz User para tipar userData

    if (userData.role === 'admin') {
      this.router.navigate(['/tabs-admin/home-admin']);
    } else if (userData.role === 'agent') {
      this.router.navigate(['/tabs-agent/home-agent']);
    } else {
      this.router.navigate(['/tabs/home-user']);
    }
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['/login']);
  }
}
