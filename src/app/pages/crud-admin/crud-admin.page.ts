import { Component, OnInit, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-crud-admin',
  templateUrl: './crud-admin.page.html',
  styleUrls: ['./crud-admin.page.scss'],
})
export class CrudAdminPage implements OnInit {
  usuarios: any[] = [];
  alertController = inject(AlertController);
  utilSvc=inject(UtilService)

  constructor(private usersService: UserService, private router: Router) { }


  user(): User {
    return this.utilSvc.getFormLocalStorage('user');
  }

  ngOnInit() {
    this.getUsers(); 
  }

  getUsers() {
    this.usersService.getUsers().subscribe(data => {
      this.usuarios = data.map((element: any) => {
        return {
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        };
      }).filter(user=>user.role==='admin')
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
