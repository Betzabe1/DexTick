import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-form-registro',
  templateUrl: './form-registro.component.html',
  styleUrls: ['./form-registro.component.scss'],
})
export class FormRegistroComponent {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    empresa: new FormControl('', [Validators.required, Validators.minLength(3)]),
    tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl('', [Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    role: new FormControl('client'),
    image: new FormControl('')
  });

  firebaseSvc = inject(UserService);
  utilSvc = inject(UtilService);
  imageDataUrl: string | null = null;

  async takeImage() {
    try {
      const result = await this.utilSvc.takePicture('Imagen de Perfil');
      this.imageDataUrl = result.dataUrl;
      this.form.controls['image'].setValue(this.imageDataUrl);
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      this.firebaseSvc.singUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;
        this.form.controls['uid'].setValue(uid);

        // Subir image
        if (this.imageDataUrl) {
          const imagePath = `users/${uid}/perfil`;
          const imageUrl = await this.firebaseSvc.uploadImage(imagePath, this.imageDataUrl);
          this.form.controls['image'].setValue(imageUrl);
        }

        await this.setUserInfo(uid);

      }).catch(error => {
        console.log(error);
        this.utilSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    } else {
      this.markAllAsTouched();
      this.utilSvc.presentToast({
        message: 'Por favor, complete los campos correctamente.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }
  }

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      const userInfo = { ...this.form.value, tel: Number(this.form.value.tel), uid };

      delete userInfo.password;

      this.firebaseSvc.setDocument(path, userInfo).then(async res => {
        this.utilSvc.saveInLocalStorage('user', userInfo);
        this.utilSvc.routerLink('/tabs/home-user');
        this.form.reset();

        this.utilSvc.presentToast({
          message: 'Registro Exitoso!!',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'person-circle-outline'
        });

      }).catch(error => {
        console.log(error);
        this.utilSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  markAllAsTouched() {
    this.form.markAllAsTouched();
  }
}
