import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Service } from 'src/app/models/service.model';

@Component({
  selector: 'app-add-update-service',
  templateUrl: './add-update-service.component.html',
  styleUrls: ['./add-update-service.component.scss'],
})
export class AddUpdateServiceComponent implements OnInit {
  @Input() categoryId: string;
  @Input() subcategoryId: string;
  @Input() subcategoria: string;
  @Input() service: Service;
  @Output() serviceAdded = new EventEmitter<any>();

  title: string = 'Agregar Servicio';

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    image: new FormControl('', [Validators.required]),
    precio:new FormControl(0,[Validators.required, Validators.min(0)])
  });

  utilSvc = inject(UtilService);
  firebaseSvc = inject(UserService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilSvc.getFromLocalStorage('user');
    if (this.service) {
      this.form.patchValue(this.service);
      this.title = 'Actualizar Servicio';
    }
  }

  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.service) {
        this.updateService();
      } else {
        this.createService();
      }
    }
  }

  async createService() {
    const path = `categorias/${this.categoryId}/subcategorias/${this.subcategoryId}/servicios`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    try {
      let dataUrl = this.form.value.image;
      let imagePath = `${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id;

      await this.firebaseSvc.addDocument(path, this.form.value);
      this.utilSvc.dismissModal({ success: true });
      this.serviceAdded.emit(this.form.value);

      this.utilSvc.presentToast({
        message: 'Servicio agregado exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  async updateService() {
    const path = `categorias/${this.categoryId}/subcategorias/${this.subcategoryId}/servicios/${this.service.id}`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    try {
      if (this.form.value.image !== this.service.image) {
        let dataUrl = this.form.value.image;
        let imagePath = await this.firebaseSvc.getFilePath(this.service.image);
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.form.controls.image.setValue(imageUrl);
      }

      delete this.form.value.id;

      await this.firebaseSvc.updateDocument(path, this.form.value);
      this.utilSvc.dismissModal({ success: true });
      this.serviceAdded.emit(this.form.value);

      this.utilSvc.presentToast({
        message: 'Servicio actualizado exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  dismissModal() {
    this.utilSvc.dismissModal();
  }
}
