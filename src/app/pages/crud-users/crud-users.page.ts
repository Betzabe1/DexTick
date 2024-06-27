import { Component, OnInit, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-crud-users',
  templateUrl: './crud-users.page.html',
  styleUrls: ['./crud-users.page.scss'],
})
export class CrudUsersPage implements OnInit {
  usuarios: any[] = [];
  alertController = inject(AlertController);
  utilSvc=inject (UtilService)


  constructor(private usersService: UserService) { }
  user(): User {
    return this.utilSvc.getFormLocalStorage('user');
  }
  ngOnInit() {
    this.getUsers(); // Llamar a getUsers en ngOnInit
    this.loadUser();

  }

  loadUser() {
    this.user = this.utilSvc.getFromLocalStorage('user');
  }

  getUsers() {
    this.usersService.getUsers().subscribe(data => {
      this.usuarios = data.map((element: any) => {
        return {
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        };
      }).filter(user=>user.role==='client')
    });
  }

  async confirmEliminarUsuario(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarUsuario(id);
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarUsuario(id: string) {
    this.usersService.eliminarUsuario(id).then(() => {
      console.log('Usuario eliminado con éxito');
      // Actualiza la lista de usuarios después de eliminar
      this.getUsers();
    }).catch(error => {
      console.log(error);
    });
  }
}
