import { Injectable, inject } from '@angular/core';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions} from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  loadingCtrl=inject(LoadingController);
  toastCtrl=inject(ToastController);
  modalCtr=inject(ModalController);
  router=inject(Router);
  firestore=inject(AngularFirestore)


 async takePicture(promptLabelHeader:string){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source:CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto:'Selecciona una imagen',
      promptLabelPicture:'Toma una foto '
    });
  };



  async takesPicture(title: string): Promise<{ dataUrl: string }> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    return { dataUrl: image.dataUrl };
  }

  //======Loading========
  loading(){
    return this.loadingCtrl.create({spinner:'crescent'})
  }

    //======Toast========
    async presentToast(opts?:ToastOptions) {
      const toast = await this.toastCtrl.create(opts);
      toast.present();
    }

    //Enrutar a pagina
    routerLink(url:string){
      return this.router.navigateByUrl(url);
    }

    //Save in localStorage
    saveInLocalStorage(key:string, value:any){
      return localStorage.setItem(key, JSON.stringify(value));
    }

    //Obtiene elemnto localStorahe
    getFormLocalStorage(key:string){
      return JSON.parse(localStorage.getItem(key));
    }
    getFromLocalStorage(key: string): any {
      const data = localStorage.getItem(key);
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        return null;
      }
    }

    removeFromLocalStorage(key: string): void {
      localStorage.removeItem(key);
    }

   //limpiar local storage
   clearLocalStorage() {
    localStorage.clear();
  }

  //Modal
  async presentModal(opts:ModalOptions) {
    const modal = await this.modalCtr.create(opts);
    await modal.present();

    const {data}= await modal.onWillDismiss();
    if(data) return data;
  }

  dismissModal(data?:any){
    return this.modalCtr.dismiss(data);
  }

  // Método para actualizar un documento en Firestore
  // updateDoc(data: any, path: string, uid: string): Promise<void> {
  //   // Construye la ruta completa al documento
  //   const docRef = this.firestore.doc(`${path}/${uid}`);

  //   // Actualiza el documento con los datos proporcionados
  //   return docRef.update(data)
  //     .then(() => {
  //       console.log('Documento actualizado correctamente');
  //     })
  //     .catch((error) => {
  //       console.error('Error al actualizar el documento:', error);
  //     });
  // }
   updateDoc(path: string, data: any) {
     return this.firestore.doc(path).update(data);
   }

}
