import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user = {
    name: '',
    email: '',
    telefono: '',
    password:''
    };

  constructor(
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async signUp() {
  this.user.name = this.user.name.trim();
  this.user.email = this.user.email.trim();
  this.user.telefono = this.user.telefono.trim();
  this.user.password = this.user.password.trim();


    if (!this.user.name || !this.user.email || !this.user.telefono || !this.user.password) {
      await this.presentAlert('Campos Incompletos', 'Por favor, complete todos los campos.');
      return;
    }

    this.userService.signUp(this.user).subscribe(
      async (res: any) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        await this.presentAlert('Registro Exitoso', 'Su cuenta ha sido creada exitosamente.');
        this.router.navigate(['/login']);
      },
      async (err: any) => {
        console.log(err);
        await this.presentAlert('Error', 'Hubo un problema con el registro. Inténtelo nuevamente.');
      }
    );
  }
}
