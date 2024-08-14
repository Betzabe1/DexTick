import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { AddUpdateServiceComponent } from 'src/app/components/add-update-service/add-update-service.component';
import { User } from 'src/app/models/user.model';
import { TicketsService } from 'src/app/services/tickets.service';
import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-service-options',
  templateUrl: './service-options.page.html',
  styleUrls: ['./service-options.page.scss'],
})
export class ServiceOptionsPage implements OnInit {

  fecha: Date = new Date();
  selectedService: any = null;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];

  isServiceSelected: boolean = false;
  isResolutionModeSelected: boolean = false;

  isDateTimeOpen = false;
  selectedDate: string | null = null;
  isRemoteSelected = false;
  problemDescription: string = '';

  categoryId: string = '';
  subCategoryId: string = '';
  services = [];

  user: User = {} as User;

  constructor(
    public ticketServi: TicketsService,
    private route: ActivatedRoute,
    private router: Router,
    private utilSvc: UtilService,
    private alertCtrl: AlertController,
    private firebaseSvc: UserService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.user = this.utilSvc.getFormLocalStorage('user');
    if (!this.user || !this.user.uid) {
      console.error('User not found or UID not available');
      return;
    }
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

            try {
              let imagePath = await this.firebaseSvc.getFilePath(service.image);
              await this.firebaseSvc.deleteFile(imagePath);
              await this.firebaseSvc.deleteDocument(path);
              this.loadServices();
            } catch (error) {
              console.error('Error deleting service:', error);
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  selectService(service: any) {
    if (this.selectedService === service) {
      this.selectedService = null;
      this.isServiceSelected = false;
    } else {
      this.selectedService = service;
      this.isServiceSelected = true;
    }
  }

  toggleRemoteSelection(event: any) {
    this.isRemoteSelected = event.detail.checked;
    this.isResolutionModeSelected = true; // Selección de resolución se ha hecho
    console.log('Servicio remoto:', this.isRemoteSelected);

    if (this.isRemoteSelected) {
      this.isDateTimeOpen = false;
    }
  }

  async toggleDateTime() {
    if (!this.isRemoteSelected) {
      this.isDateTimeOpen = !this.isDateTimeOpen;
      if (this.isDateTimeOpen) {
        this.isResolutionModeSelected = true;
      }
    }
  }

  async dismissModal() {
    const modal = await this.modalCtrl.getTop();
    if (modal) {
      await modal.dismiss();
    }
  }

  onDateTimeChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.selectedDate = selectedDate.toISOString();
    const formattedDate = this.selectedDate.split('T')[0];
    console.log('Presencial:', formattedDate);
  }

  onDateTimeDismiss(event: any) {
    this.isDateTimeOpen = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files: FileList = input.files;
    this.imagePreviews = [];
    this.selectedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFiles.push(file);
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          this.imagePreviews.push(reader.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  }

  async openDateTimeModal() {
    const modal = await this.modalCtrl.create({
      component: Date,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async takeImage() {
    try {
      const dataUrl = (await this.utilSvc.takePicture('Imagen de evidencia')).dataUrl;
      if (dataUrl) {
        // Guardar la imagen en el array de previsualización
        this.imagePreviews.push(dataUrl);
        // Subir la imagen y obtener la URL
        const imagePath = `${Date.now()}`;
        const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        // Aquí puedes almacenar imageUrl en tu modelo de ticket
        console.log('Imagen subida exitosamente:', imageUrl);
      } else {
        this.utilSvc.presentToast({
          message: 'No se pudo capturar la imagen.',
          duration: 2500,
          color: 'warning',
          position: 'middle',
          icon: 'warning'
        });
      }
    } catch (error) {
      console.error('Error al tomar la imagen:', error);
      this.utilSvc.presentToast({
        message: 'Error al tomar la imagen.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert'
      });
    }
  }

  async presentConfirmAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres enviar el ticket?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Usuario canceló el envío del ticket.');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.ticket(); // Llama al método para enviar el ticket
          }
        }
      ]
    });

    await alert.present();
  }

  async ticket() {
    const fechaActual = new Date();
    let fechaP: Date | null = null;

    if (!this.isRemoteSelected && this.selectedDate) {
      const selectedDate = new Date(this.selectedDate);
      fechaP = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    }

    // Subir todas las imágenes seleccionadas y obtener las URLs
    const imageUrls = await Promise.all(this.imagePreviews.map(async (dataUrl) => {
      const imagePath = `${Date.now()}-${Math.random()}`;
      return await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    }));

    const newTicket: Ticket = {
        id: '',
        emailA:'',
        userId: this.user.uid,
        emailClient: this.user.email,
        telClient: this.user.tel,
        nameClient: this.user.name,
        servicio: this.selectedService?.name || '',
        desc: this.problemDescription,
        solicitud: this.isRemoteSelected ? 'remoto' : 'presencial',
        fechaP: fechaP,
        estado: 'enviado',
        imagenes: imageUrls, // Almacenar URLs en un array
        fecha: fechaActual,
        fechaPr:null,
        fechaF:null,
        subtotal:this.selectService?.prototype || 0,
        Total: null
    };

    console.log('Ticket:', newTicket);

    const path = `users/${this.user.uid}/tickets`;

    const loading = await this.utilSvc.loading();
    await loading.present();

    try {
      // Usa el servicio para guardar el ticket en la subcolección
      await this.ticketServi.createPedidoInSubcollection(this.user.uid, newTicket);
      this.utilSvc.presentToast({
        message: 'Ticket enviado exitosamente.',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle'
      });

      this.dismissModal();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al enviar el ticket:', error);
      this.utilSvc.presentToast({
        message: 'Error al enviar el ticket.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert'
      });
    } finally {
      loading.dismiss();
    }
  }
}
