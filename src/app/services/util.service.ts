import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions} from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  loadingCtrl=inject(LoadingController);
  toastCtrl=inject(ToastController);
  router=inject(Router);

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


}
