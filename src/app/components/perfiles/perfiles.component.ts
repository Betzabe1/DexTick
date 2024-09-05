import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss'],
})
export class PerfilesComponent implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    empresa: new FormControl(''),
    tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl('', [Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    role: new FormControl('client'),
    image: new FormControl('') // Agregar el campo image al formulario
  });

  firebaseSvc = inject(UserService);
  utilSvc = inject(UtilService);
  alertController = inject(AlertController);

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    const user = this.user();
    if (user) {
      this.form.patchValue({
        uid: user.uid,
        email: user.email,
        empresa: user.empresa,
        tel: user.tel,
        name: user.name,
        role: user.role,
        image: user.image
      });
    }
  }

  user(): User {
    return this.utilSvc.getFormLocalStorage('user');
  }

  async takeImage() {
    let user = this.user();
    let path = `users/${user.uid}`;

    const dataUrl = (await this.utilSvc.takePicture('Imagen de Perfil')).dataUrl;

    const loading = await this.utilSvc.loading();
    await loading.present();

    let imagePath = `${user.uid}/perfil`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path, { image: user.image }).then(async res => {
      this.utilSvc.saveInLocalStorage('user', user);

      this.utilSvc.presentToast({
        message: 'Foto actualizada',
        duration: 1500,
        color: 'success',
        icon: 'checkmark-circle-outline'
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

  async comfirmSubmit() {
    const alert = await this.alertController.create({
      header: 'Confirmar actualización',
      message: '¿Estás seguro de que deseas actualizar el usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.submit();
          }
        }
      ]
    });

    await alert.present();
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      const userInfo = {
        ...this.form.value,
      };
      const path = `users/${userInfo.uid}`;

      // Actualizar contraseña en Firebase Authentication si se ha cambiado
      if (this.form.controls.password.value) {
        await this.firebaseSvc.updatePassword(this.form.controls.password.value);
      }

      // Eliminar el campo password antes de actualizar Firestore
      delete userInfo.password;

      // Actualizar información del usuario en Firestore
      this.firebaseSvc.updateDocument(path, userInfo).then(async res => {
        // Actualizar información local
        this.utilSvc.saveInLocalStorage('user', userInfo);

        this.utilSvc.presentToast({
          message: 'Perfil actualizado',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
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

  markAllAsTouched() {
    this.form.markAllAsTouched();
  }
}
