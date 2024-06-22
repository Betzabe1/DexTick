import { Component, inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tabs-agent',
  templateUrl: './tabs-agent.page.html',
  styleUrls: ['./tabs-agent.page.scss'],
})
export class TabsAgentPage  {
  firebaseSvc = inject(UserService);
  utilSvc = inject(UtilService);
  alertController = inject(AlertController);

  async signOut() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Confirmación cancelada');
          }
        },
        {
          text: 'Salir',
          handler: () => {
            this.firebaseSvc.signOut();
          }
        }
      ]
    });

    await alert.present();
  }
}
