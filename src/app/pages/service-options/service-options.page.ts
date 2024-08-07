import { Component, inject, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { AddUpdateServiceComponent } from 'src/app/components/add-update-service/add-update-service.component';

@Component({
  selector: 'app-service-options',
  templateUrl: './service-options.page.html',
  styleUrls: ['./service-options.page.scss'],
})
export class ServiceOptionsPage implements OnInit {

  selectedDate: string | undefined;
  isDateTimeOpen: boolean = false;

  fecha: Date=new Date();

  categoryId: string = '';
  subCategoryId: string = '';
  services: any[] = [];
  problemDescription: string = '';
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;


  utilSvc = inject(UtilService);
  firebaseSvc = inject(UserService);
  alertController=inject(AlertController)
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }


  toggleDateTime() {
    this.isDateTimeOpen = true;
  }

  onDateTimeChange(event: any) {
    this.selectedDate = event.detail.value;
    console.log('Selected date:', this.selectedDate);
    this.isDateTimeOpen = false; // Close the modal after selecting a date
  }

  onDateTimeDismiss(event: any) {
    this.isDateTimeOpen = false;
  }

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



  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Selecciona el tipo de servicio',
      buttons: [
        {
          text: 'Remoto',
          handler: () => {
            this.showSuccessAlert('Servicio remoto seleccionado');
          }
        },
        {
          text: 'Presencial',
          handler: () => {
            this.showCalendar();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async showCalendar() {
    const alert = await this.alertController.create({
      header: 'Seleccione una fecha',
      inputs: [
        {
          name: 'date',
          type: 'date',
          placeholder: 'Seleccione una fecha'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            this.showSuccessAlert(`Fecha seleccionada: ${data.date}`);
          }
        }
      ]
    });

    await alert.present();
  }

  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }



  toggleAccordion() {
    const content = document.querySelector('.accordion-content');
    if (content) {
      content.classList.toggle('expanded');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

//enviar ticket
  async add(){

  }
}

