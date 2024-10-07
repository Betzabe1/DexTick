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
  @Input() categoria: Category;
  @Output() categoryAdded = new EventEmitter<any>();
  empresas: string[]=[];
  title: string = 'Agregar Categoria';

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    empresas: new FormControl([], [Validators.required])
  });

  utilSvc = inject(UtilService);
  firebaseSvc = inject(UserService);

  constructor(private userService: UserService) { }
  user = {} as User;

  ngOnInit():void {
    this.user = this.utilSvc.getFromLocalStorage('user');
    if (this.categoria) {
      this.title = 'Actualizar Categoria';
      this.form.setValue({
        id: this.categoria.id || '',
        image: this.categoria.image || '',
        name: this.categoria.name || '',
        empresas: this.categoria.empresas || []
      });
    }

    this.userService.getEmpresa().subscribe(users =>{
      this.empresas=Array.from(new Set(
        users
        .filter(user=> !!user.empresa)
        .map(user=> user.empresa)
      ))
    })
  }

  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.categoria) {
        this.updateCategory();
      } else {
        this.createCategory();
      }
    }
  }

  async createCategory() {
    let path = `categorias`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    let dataUrl = this.form.value.image;
    let imagePath = `${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    const newCategory={
      ...this.form.value,
      empresas:this.form.value.empresas
    }

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
    let path = `categorias/${this.categoria.id}`;

    const loading = await this.utilSvc.loading();
    await loading.present();

    if (this.form.value.image !== this.categoria.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.categoria.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    const updatedCategory = {
      ...this.form.value,
      empresas: this.form.value.empresas
    };

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
