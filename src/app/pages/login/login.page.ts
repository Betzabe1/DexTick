import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    email: '',
    password: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async signIn() {
    // Limpiar los campos de entrada
    this.user.email = this.user.email.trim();
    this.user.password = this.user.password.trim();

    if (!this.user.email || !this.user.password) {
      await this.presentAlert('Error de inicio de sesión', 'Por favor, ingrese su correo electrónico y contraseña.');
      return;
    }

    try {
      const response = await this.userService.signIn(this.user.email, this.user.password).toPromise();
      if (response && response.token) {
        // Guardar el token en el almacenamiento local
        localStorage.setItem('token', response.token);
        // Redirigir al usuario después de una autenticación exitosa
        this.router.navigate(['/home-agente']);
      } else {
        await this.presentAlert('Error de inicio de sesión', 'Ha ocurrido un error inesperado.');
      }
    } catch (err: any) {
      console.log('Error:', err);
      await this.presentAlert('Error de inicio de sesión', err.error || 'Ha ocurrido un error inesperado.');
    }
  }
}
