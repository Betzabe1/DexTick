import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilService } from './util.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref ,getDownloadURL, deleteObject } from 'firebase/storage';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
auth=inject(AngularFireAuth);
utilSvc=inject(UtilService);
storage=inject(AngularFireStorage);

constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
  this.setPersistence();
}

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

singUp(user: User) {
  return createUserWithEmailAndPassword(getAuth(),user.email, user.password);
}


  // Crear usuario como administrador
  async signUpA(user: User, role: string): Promise<any> {
    try {
      // Crear usuario sin cambiar el contexto de autenticación actual
      const credential = await createUserWithEmailAndPassword(getAuth(), user.email, user.password);
      await this.assignRole(credential.user.uid, role); // Asignar rol al usuario recién creado
      return credential;
    } catch (error) {
      throw error;
    }
  }
 // Asignar rol al usuario en Firestore
 private async assignRole(userId: string, role: string): Promise<void> {
  try {
    await this.firestore.collection('users').doc(userId).set({ role });
  } catch (error) {
    console.error('Error asignando rol:', error);
  }
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

private async setPersistence() {
  try {
    await this.afAuth.setPersistence('local');
  } catch (error) {
    console.error("Error setting persistence:", error);
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

//Actualizar documento
updateDocument(path:string, data:any){
  return updateDoc(doc(getFirestore(), path), data)
  }

//Obtener documento
async getDocumen(path:string){
  return (await getDoc(doc(getFirestore(),path))).data();
}

async getDocument(docPath: string): Promise<any> {
  const docRef = this.firestore.doc(docPath).ref;
  const docSnap = await docRef.get();
  return docSnap.exists ? docSnap.data() : null;
}


//Agregar documento
addDocument(path:string, data:any){
  return addDoc(collection(getFirestore(), path),data);
}

//Obtener  documento de una coleccion
getCollectionDat(path: string, collectionQuery?: any) {
  const ref = collection(getFirestore(), path);
  return collectionData(query(ref,collectionQuery), {idField:'id'});
}

getCollectionData(path: string, collectionQuery?: any) {
  const q = query(collection(getFirestore(), path), collectionQuery);
  return collectionData(q);
}
//obtener usuarios
getUsers(): Observable<any[]> {
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
//subir imagen vi
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


updateDocumen(path: string, data: any) {
  return this.firestore.doc(path).update(data);
}





  //obtener ruta de la imagen
 async getFilePath(url:string){
     return ref(getStorage(), url).fullPath
  }
  getCurrentUser(): Promise<any> {
    return this.auth.currentUser;
  }
  setUserSession(user: any): Promise<void> {
    return this.auth.updateCurrentUser(user);
  }

  async updatePassword(newPassword: string) {
    const user = await this.auth.currentUser;
    if (user) {
      return user.updatePassword(newPassword);
    } else {
      throw new Error('No user is currently logged in');
    }
  }


  //Eliminar archivos
  deleteFile(path:string){
  return deleteObject(ref(getStorage(), path))
  }
//eliminar docuemnto
deleteDocument(path:string){
  return deleteDoc(doc(getFirestore(), path))
}



async getDocuments(path: string) {
  const snapshot = await this.firestore.collection(path).get().toPromise();
  return snapshot.docs.map(doc => doc.data());
}

getFromLocalStorage(key: string): Service | null {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// UserService

async uploadFile(file: File, path: string): Promise<string> {
  const fileRef = this.storage.ref(path);
  await fileRef.put(file);
  return await fileRef.getDownloadURL().toPromise();
}

getAllUsers() {
  return this.firestore.collection('users').valueChanges();
}

 // Obtener el rol del usuario
 getUserRole(userId: string): Promise<'client' | 'agent' | 'admin' | null> {
  return this.firestore.collection<User>('users').doc(userId).get().toPromise()
    .then(doc => {
      if (doc.exists) {
        const userData = doc.data();
        return userData ? userData.role : null;
      } else {
        return null;
      }
    });
}
  // Método para obtener el UID del usuario actualmente autenticado

  // Método para obtener el UID del usuario autenticado
  async getUid(): Promise<string | null> {
    try {
      const user = await this.afAuth.currentUser;
      return user ? user.uid : null;
    } catch (error) {
      console.error('Error al obtener UID:', error);
      return null;
    }
  }


  stateAuth(): Observable<any> {
    return this.afAuth.authState;
  }

  getCurrentUserRole(){

  }

getEmpresa():Observable<User[]>{
 return this.firestore.collection<User>('users').valueChanges();
}
}
