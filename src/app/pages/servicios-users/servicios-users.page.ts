import { Component, OnInit, Inject, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { Ticket } from '../../models/ticket.model';
import { User } from 'src/app/models/user.model';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-servicios-users',
  templateUrl: './servicios-users.page.html',
  styleUrls: ['./servicios-users.page.scss'],
})
export class ServiciosUsersPage implements OnInit {

  fecha: Date = new Date();
  selectedService: any = null;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];

  isServiceSelected: boolean = false;
  isResolutionModeSelected: boolean = false;

  isDateTimeOpen = false;
  selectedDate: string; // Formato ISO con fecha y hora
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
    this.isResolutionModeSelected = true;
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

  // Seleccionar fecha
  onDateTimeChange(event: any) {
    this.selectedDate = event.detail.value;
    console.log('Selected Date:', this.selectedDate);
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
        this.imagePreviews.push(dataUrl);
        const imagePath = `${Date.now()}`;
        const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
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
      fechaP = new Date(this.selectedDate); // Mantén la fecha y la hora completas
      console.log('FechaP con hora que se guarda en Firebase:', fechaP?.toISOString());
    }

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
      imagenes: imageUrls,
      fecha: fechaActual,
      fechaPr: null,
      fechaF: null,
      subtotal: this.selectedService?.precio,
      Total: null,
      empresa: this.user.empresa
    };

    console.log('Creating ticket with empresa:', newTicket.empresa);

    const path = `users/${this.user.uid}/tickets`;

    const loading = await this.utilSvc.loading();
    await loading.present();

    try {
      await this.ticketServi.createPedidoInSubcollection(this.user.uid, newTicket);
      this.utilSvc.presentToast({
        message: 'Ticket realizado exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
      this.dismissModal();
      this.resetFields();
    } catch (error) {
      console.error('Error al realizar el ticket:', error);
      this.utilSvc.presentToast({
        message: 'Error al realizar el ticket. Inténtalo de nuevo.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  resetFields() {
    this.selectedService = null;
    this.isServiceSelected = false;
    this.imagePreviews = [];
    this.selectedFiles = [];
    this.isDateTimeOpen = false;
    this.isRemoteSelected = false;
    this.problemDescription = '';
  }
}
