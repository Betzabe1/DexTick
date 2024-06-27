import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage  {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  firebaseSvc = inject(UserService);
  utilSvc = inject(UtilService);


  async submit() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

     this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res=>{

        this.utilSvc.presentToast({
          message: 'Correo enviado con éxito',
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        });

        this.utilSvc.routerLink('/login');
        this.form.reset();
      }).catch (error=> {
        console.error(error);

        this.utilSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(()=> {
        loading.dismiss();
      })
    }
  }
}
