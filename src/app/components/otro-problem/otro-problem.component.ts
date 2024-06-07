import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-otro-problem',
  templateUrl: './otro-problem.component.html',
  styleUrls: ['./otro-problem.component.scss']
})
export class OtroProblemComponent {
  problemDescription: string = '';
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedDate: Date | null = null;

  constructor(private alertController: AlertController) {}

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

  async submitProblem() {
    console.log('Descripción del problema:', this.problemDescription);
    if (this.selectedImage) {
      console.log('Imagen seleccionada:', this.selectedImage.name);
    }
    await this.showAlert();
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
}
