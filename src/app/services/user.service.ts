import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from'firebase/auth';
import { User } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore,setDoc, doc, getDoc, addDoc, collection,collectionData, query, updateDoc } from '@angular/fire/firestore'
import { UtilService } from './util.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {getStorage, uploadString,ref, getDownloadURL} from'firebase/storage'

@Injectable({
  providedIn: 'root'
})
export class UserService {
auth=inject(AngularFireAuth);
firestore=inject(AngularFirestore);
utilSvc=inject(UtilService);
storage=inject(AngularFireStorage);



//=========AUTENTICACION==========
getAuth(){
  return getAuth();
}

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



  //=====Cerarr cesion===
signOut(){
  getAuth().signOut();
  localStorage.removeItem('user');
  this.utilSvc.routerLink('/login')

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

//Actualizar documento
updateDocument(path:string, data:any){
  return updateDoc(doc(getFirestore(), path), data)
  }

//Obtener documento
async getDocument(path:string){
  return (await getDoc(doc(getFirestore(), path))).data();
}


//Agregar documento
addDocument(path:string, data:any){
  return addDoc(collection(getFirestore(), path),data);
}

//Obtener  documento de una coleccion
getColletionData (path:string, collectionQuery?:any){
  const ref=collection(getFirestore(),path)
  return collectionData(query(ref,collectionQuery))
}


//almaxcensmienti
//subir imagen
async uploadImage(path:string, data_url:string){
  return uploadString(ref(getStorage(),path),data_url,'data_url').then(()=>{
    return getDownloadURL(ref(getStorage(),path ))
  })
}

  //obtener ruta de la imagen
  getFilePath(url:string){
     return ref(getStorage(), url).fullPath
  }


  async updatePassword(newPassword: string) {
    const user = await this.auth.currentUser;
    if (user) {
      return user.updatePassword(newPassword);
    } else {
      throw new Error('No user is currently logged in');
    }
  }


}
