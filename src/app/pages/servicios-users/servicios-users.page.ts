import { Component, inject, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { AddUpdateServiceComponent } from 'src/app/components/add-update-service/add-update-service.component';

@Component({
  selector: 'app-servicios-users',
  templateUrl: './servicios-users.page.html',
  styleUrls: ['./servicios-users.page.scss'],
})
export class ServiciosUsersPage implements OnInit {
  categoryId: string = '';
  subCategoryId: string = '';
  services: any[] = [];

  utilSvc = inject(UtilService);
  firebaseSvc = inject(UserService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId') ?? '';
      this.subCategoryId = params.get('subCategoryId') ?? '';
      console.log('Received categoryId:', this.categoryId, 'and subCategoryId:', this.subCategoryId);

      if (this.subCategoryId && this.categoryId) {
        this.loadServices();
      } else {
        console.error('subCategoryId or categoryId param is null');
      }
    });
  }

  loadServices() {
    const path = `categorias/${this.categoryId}/subcategorias/${this.subCategoryId}/servicios`;
    this.firebaseSvc.getCollectionDat(path).subscribe({
      next: (res: any) => {
        this.services = res;
        console.log('Services loaded:', this.services);
      },
      error: (err: any) => {
        console.error('Error loading services:', err);
      }
    });
  }

  async editService(service: any) {
    const modal = await this.modalCtrl.create({
      component: AddUpdateServiceComponent,
      componentProps: { categoryId: this.categoryId, subcategoryId: this.subCategoryId, service }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.success) {
        this.loadServices();
      }
    });

    await modal.present();
  }

  async deleteService(service: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el servicio ${service.name}?`,
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
          handler: async () => {
            const path = `categorias/${this.categoryId}/subcategorias/${this.subCategoryId}/servicios/${service.id}`;
            const loading = await this.utilSvc.loading();
            await loading.present();

            let imagePath = await this.firebaseSvc.getFilePath(service.image);
            await this.firebaseSvc.deleteFile(imagePath);

            this.firebaseSvc.deleteDocument(path).then(() => {
              loading.dismiss();
              this.loadServices();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  user(): any {
    return this.utilSvc.getFormLocalStorage('user');
  }
}
