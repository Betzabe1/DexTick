import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from'firebase/auth';
import { User } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore,setDoc, doc, getDoc, addDoc, collection,collectionData, query, updateDoc } from '@angular/fire/firestore'
import { UtilService } from './util.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {getStorage, uploadString,ref, getDownloadURL} from'firebase/storage'
import { Observable } from 'rxjs';

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
signUp(user: User) {
  return this.auth.createUserWithEmailAndPassword(user.email, user.password);
}

//Actualizar
updateUser(displayName:string){
  return updateProfile(getAuth().currentUser, {displayName})
}




  // Enviar correo de recuperación
 sendRecoveryEmail(email: string){
   return sendPasswordResetEmail(getAuth(), email)
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
getCollectionData(path: string, collectionQuery?: any) {
  const q = query(collection(getFirestore(), path), collectionQuery);
  return collectionData(q);
}
//obtener usuarios
getUsers():Observable<any>{
  return this.firestore.collection('users').snapshotChanges();
}


getUserById(id: string): Observable<User> {
  return this.firestore.collection('users').doc<User>(id).valueChanges();
}


//eliminar usuarios
eliminarUsuario(id:string):Promise<any>{
  return this.firestore.collection('users').doc(id).delete();

}

//almaxcensmienti
//subir imagen
async uploadImage(path:string, data_url:string){
  return uploadString(ref(getStorage(),path),data_url,'data_url').then(()=>{
    return getDownloadURL(ref(getStorage(),path ))
  })
}


async uploadinImage(path: string, dataUrl: string): Promise<string> {
  const ref = this.storage.ref(path);
  await ref.putString(dataUrl, 'data_url');
  return await ref.getDownloadURL().toPromise();
}

updatDocument(path: string, data: any) {
  return this.firestore.doc(path).update(data);
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
