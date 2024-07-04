import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { User } from 'src/app/models/user.model';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-editar-admins',
  templateUrl: './editar-admins.page.html',
  styleUrls: ['./editar-admins.page.scss'],
})
export class EditarAdminsPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    empresa: new FormControl(''),
    tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl('', [Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    role: new FormControl('', [Validators.required]),
    image: new FormControl('')
  });

  firebaseSvc = inject(UserService);
  utilSvc = inject(UtilService);
  route = inject(ActivatedRoute);
  alertController = inject(AlertController);


  constructor(
    private location: Location,
  ) {}
  users(): User {
    return this.utilSvc.getFormLocalStorage('user');
  }

  ngOnInit() {
    this.loadUserData();
  }
  async takeImage() {
    const userId = this.form.controls.uid.value;
    const path = `users/${userId}`;
    let loading;

    try {
      const dataUrl = (await this.utilSvc.takePicture('Imagen de Perfil')).dataUrl;

      loading = await this.utilSvc.loading();
      await loading.present();

      const imagePath = `${userId}/perfil`;
      const userImage = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

      await this.firebaseSvc.updateDocument(path, { image: userImage });

      // Actualizar el usuario en el formulario
      this.form.patchValue({ image: userImage });

      // Actualizar el usuario en localStorage
      const user = { ...this.form.value, image: userImage } as User;
      this.utilSvc.saveInLocalStorage('user', user);

      this.utilSvc.presentToast({
        message: 'Foto actualizada',
        duration: 1500,
        color: 'success',
        icon: 'checkmark-circle-outline'
      });

    } catch (error) {
      console.log(error);

      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      if (loading) {
        loading.dismiss();
      }
    }
  }


  async loadUserData() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.firebaseSvc.getUserById(userId).subscribe((user: User) => {
        this.form.patchValue({
          uid: user.uid,
          email: user.email,
          empresa: user.empresa,
          tel: user.tel,
          name: user.name,
          role: user.role,
          image: user.image
        });

        // Actualizar el usuario en localStorage
        this.utilSvc.saveInLocalStorage('selectedUser', user);
      });
    }
  }

  user(): User {
    return this.utilSvc.getFormLocalStorage('selectedUser');
  }



  async comfirmSubmit(){
    const alert=await this.alertController.create({
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

      const userInfo = this.form.value as User;
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
        this.utilSvc.saveInLocalStorage('selectedUser', userInfo);

        this.utilSvc.presentToast({
          message: 'Perfil actualizado',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
        this.location.back();

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
