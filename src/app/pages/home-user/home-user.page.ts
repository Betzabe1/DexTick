import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.page.html',
  styleUrls: ['./home-user.page.scss'],
})
export class HomeUserPage {

  constructor(
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async logout() {
    try {
      await this.userService.signOut();
      await this.presentAlert('Sesión cerrada', 'Has cerrado sesión correctamente.');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
      await this.presentAlert('Error', 'Hubo un problema al cerrar la sesión. Por favor, inténtalo de nuevo.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
