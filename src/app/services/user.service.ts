import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from'firebase/auth';
import { User } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore,setDoc, doc, getDoc } from '@angular/fire/firestore'
@Injectable({
  providedIn: 'root'
})
export class UserService {
auth=inject(AngularFireAuth);
firestore=inject(AngularFirestore);

//=========AUTENTICACION==========

//Acceder
signIn(user:User){
return signInWithEmailAndPassword(getAuth(), user.email, user.password)
}

//Crear
signUp(user:User){
  return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
}

//Actualizar
updateUser(displayName:string){
  return updateProfile(getAuth().currentUser, {displayName})
}

  // Enviar correo de recuperación
async sendRecoveryEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(getAuth(), email);
    } catch (error) {
      throw new Error(this.mapErrorMessage(error.code));
    }
  }

  private mapErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'El correo electrónico no está registrado.';
      // otros casos de error
      default:
        return 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.';
    }
  }
//=========BD==========
//Setear documento
setDocument(path:string, data:any){
return setDoc(doc(getFirestore(), path), data)
}

//Obtener documento
async getDocument(path:string){
  return (await getDoc(doc(getFirestore(), path))).data();
}






}
