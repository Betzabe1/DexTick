import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(AngularFireAuth);

  constructor(private userService: UserService) {}

  // getCurrentUserRole(): Promise<string> {
  //   return this.auth.currentUser.then(user => {
  //     if (user) {
  //       return this.userService.getDocument(`users/${user.uid}`).then(doc => doc.role);
  //     }
  //     return null;
  //   });
  // }



  // listenToAuthState() {
  //   this.afAuth.onAuthStateChanged(user => {
  //     if (user) {
  //       // Usuario está autenticado
  //       console.log('User is logged in:', user);
  //     } else {
  //       // Usuario no está autenticado
  //       console.log('User is not logged in.');
  //     }
  //   });
  // }

  // async login(email: string, password: string) {
  //   try {
  //     await this.afAuth.signInWithEmailAndPassword(email, password);
  //   } catch (error) {
  //     console.error('Error logging in:', error);
  //   }
  // }

  // async logout() {
  //   try {
  //     await this.afAuth.signOut();
  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //   }
  // }
}
