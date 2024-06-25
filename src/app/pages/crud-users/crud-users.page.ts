import { Component, OnInit, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-crud-users',
  templateUrl: './crud-users.page.html',
  styleUrls: ['./crud-users.page.scss'],
})
export class CrudUsersPage implements OnInit {
  usuarios: any[] = [];
  alertController = inject(AlertController);

  constructor(private usersService: UserService) { }

  ngOnInit() {
    this.getUsers(); // Llamar a getUsers en ngOnInit
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
