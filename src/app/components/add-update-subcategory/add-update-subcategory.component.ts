import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { SubCategory } from 'src/app/models/subcategory.model';
@Component({
  selector: 'app-add-update-subcategory',
  templateUrl: './add-update-subcategory.component.html',
  styleUrls: ['./add-update-subcategory.component.scss'],
})
export class AddUpdateSubcategoryComponent implements OnInit {
  @Input() categoryId: string;
  @Input() subcategoria: SubCategory;
  @Output() subcategoryAdded = new EventEmitter<any>();

  title: string = 'Agregar Subcategoría';

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),

  });

  utilSvc = inject(UtilService);
  firebaseSvc = inject(UserService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilSvc.getFromLocalStorage('user');
    if (this.subcategoria) {
      this.form.setValue(this.subcategoria);
      this.title = 'Actualizar Subcategoría';
    }
  }

  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.subcategoria) {
        this.updateSubcategory();
      } else {
        this.createSubcategory();
      }
    }
  }

  async createSubcategory() {
    const path = `categorias/${this.categoryId}/subcategorias`;
    const loading = await this.utilSvc.loading();
    await loading.present();


    let dataUrl = this.form.value.image;
    let imagePath = `${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);


    delete this.form.value.id;



    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
      this.utilSvc.dismissModal({ success: true });
      this.subcategoryAdded.emit(this.form.value);

      this.utilSvc.presentToast({
        message: 'Subcategoría agregada exitosamente.',
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

  async updateSubcategory() {
    const path = `categorias/${this.categoryId}/subcategorias/${this.subcategoria.id}`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    if (this.form.value.image !== this.subcategoria.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.subcategoria.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }


    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
      this.utilSvc.dismissModal({ success: true });
      this.subcategoryAdded.emit(this.form.value);

      this.utilSvc.presentToast({
        message: 'Subcategoría actualizada exitosamente.',
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
