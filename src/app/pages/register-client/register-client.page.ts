import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.page.html',
  styleUrls: ['./register-client.page.scss'],
})
export class RegisterClientPage {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    empresa: new FormControl(''),
    tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl('', [Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    role: new FormControl('client'), // Aquí se establece el rol como 'client'
    image: new FormControl('')
  });

  firebaseSvc = inject(UserService);
  utilSvc = inject(UtilService);
  imageDataUrl: string | null = null;

  constructor() {}

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

      // Obtener los valores del formulario
      const userData = this.form.value as User;

      try {
        // Registrar el nuevo usuario en Firebase sin cambiar la sesión actual
        const tempApp = firebase.initializeApp(firebase.app().options, 'tempApp');
        const userCredential = await tempApp.auth().createUserWithEmailAndPassword(userData.email, userData.password);
        const uid = userCredential.user?.uid || '';
        this.form.controls['uid'].setValue(uid);

        // Subir imagen si está disponible
        if (this.imageDataUrl) {
          const imagePath = `users/${uid}/perfil`;
          const imageUrl = await this.firebaseSvc.uploadImage(imagePath, this.imageDataUrl);
          this.form.controls['image'].setValue(imageUrl);
        }

        // Configurar la información del usuario en Firestore
        await this.setUserInfo(uid);

        // Cerrar la sesión temporal y eliminar la app temporal
        await tempApp.auth().signOut();
        tempApp.delete();

        // Restablecer el formulario y la imagen después del registro exitoso
        this.form.reset();
        this.imageDataUrl = null;

        // Mostrar mensaje de registro exitoso
        this.utilSvc.presentToast({
          message: 'Registro Exitoso!!',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'person-circle-outline'
        });

      } catch (error) {
        console.error('Error durante el registro:', error);

        // Mostrar mensaje de error
        this.utilSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      } finally {
        loading.dismiss();
      }
    } else {
      // Marcar todos los campos como tocados para mostrar los errores
      this.markAllAsTouched();

      // Mostrar mensaje de campos incompletos
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
    const userInfo = { ...this.form.value, tel: Number(this.form.value.tel), uid };

    // Eliminar la contraseña para no almacenarla en Firestore
    delete userInfo.password;

    // Ruta en Firestore donde se guardará la información del usuario
    const path = `users/${uid}`;

    try {
      // Guardar la información del usuario en Firestore
      await this.firebaseSvc.setDocument(path, userInfo);

    } catch (error) {
      console.error('Error al guardar la información del usuario:', error);

      // Mostrar mensaje de error
      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });

      throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
    }
  }

  markAllAsTouched() {
    // Marcar todos los campos del formulario como tocados para mostrar los errores
    this.form.markAllAsTouched();
  }
}
