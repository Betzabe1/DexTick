import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tabs-admin',
  templateUrl: './tabs-admin.page.html',
  styleUrls: ['./tabs-admin.page.scss'],
})
export class TabsAdminPage {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async presentLogoutAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmar cierre de sesión',
      message: '¿Está seguro de que desea cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout(): void {
    this.userService.signOut();
    this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión
  }
}


