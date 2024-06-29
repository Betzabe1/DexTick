import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions} from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  loadingCtrl=inject(LoadingController);
  toastCtrl=inject(ToastController);
  router=inject(Router);


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



}
