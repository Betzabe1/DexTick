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
    this.user.email = this.user.email.trim();
    this.user.password = this.user.password.trim();

    if (!this.user.email || !this.user.password) {
      await this.presentAlert('Error de inicio de sesión', 'Por favor, ingrese su correo electrónico y contraseña.');
      return;
    }

    try {
      const response = await this.userService.signIn(this.user.email, this.user.password).toPromise();
      console.log('Respuesta del servidor:', response);
      if (response && response.accessToken && response.refreshToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.router.navigate(['/home-user']);
      } else {
        await this.presentAlert('Error de inicio de sesión', 'Ha ocurrido un error inesperado.');
      }
    } catch (err: any) {
      console.log('Error:', err);
      const errorMessage = err && err.error ? err.error : 'Ha ocurrido un error inesperado.';
      await this.presentAlert('Error de inicio de sesión', errorMessage);
    }
  }
}

