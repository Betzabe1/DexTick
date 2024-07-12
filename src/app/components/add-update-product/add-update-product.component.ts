import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { User } from 'src/app/models/user.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() isModal: boolean;
  @Input() product: Category;
  @Output() categoryAdded = new EventEmitter<any>();

  title: string = 'Agregar Categoria';

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  utilSvc = inject(UtilService);
  firebaseSvc = inject(UserService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilSvc.getFromLocalStorage('user');
    if (this.product) {
      this.form.setValue(this.product);
      this.title = 'Actualizar Categoria';
    }
  }

  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) {
        this.updateCategory();
      } else {
        this.createCategory();
      }
    }
  }

  async createCategory() {
    let path = `users/${this.user.uid}/products`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
      this.utilSvc.dismissModal({ success: true });
      this.categoryAdded.emit(this.form.value);

      this.utilSvc.presentToast({
        message: 'Categoria agregada exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    }).catch(error => {
      console.log(error);
      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  async updateCategory() {
    let path = `users/${this.user.uid}/products/${this.product.id}`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    if (this.form.value.image !== this.product.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
      this.utilSvc.dismissModal({ success: true });
      this.categoryAdded.emit(this.form.value);

      this.utilSvc.presentToast({
        message: 'Categoria actualizada exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    }).catch(error => {
      console.log(error);
      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  dismissModal() {
    this.utilSvc.dismissModal();
  }
}
