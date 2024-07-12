import { AlertController } from '@ionic/angular';
import { Component, inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tipo } from 'src/app/models/tipo.model';
import { TipoService } from 'src/app/services/tipo.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from '../../services/util.service';
import { AddUpdateProductComponent } from 'src/app/components/add-update-product/add-update-product.component';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage {

  @Input() item: Category;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  firstName: string = '';
  categorias: Category[] = [];
  tipos: Tipo[] = [];
  selectedTipoId: number = -1;
  selectedCategory: string | null = 'basico';
  tipoServicioSeleccionado: number | null = null;
  utilSvc = inject(UtilService);
  firebaseSvc = inject(UserService);

  products: any[] = [];
  loading:boolean=false;

  user(): User {
    return this.utilSvc.getFormLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getCategorias();
  }

  doRefresh(event){
    setTimeout(()=>{
      this.getCategorias();
      event.target.complete();
    }, 1000)

  }

  // Obtener categorias
  getCategorias() {
    let path = `users/${this.user().uid}/products`;

    let sub = this.firebaseSvc.getCollectionDat(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        sub.unsubscribe();
      }
    });
  }

  constructor(
    private router: Router,
    private tipoService: TipoService,
    private alertController: AlertController // Inyecta AlertController aquí
  ) {}

  async addUpdateProduct(product?: Category) {
    let success = await this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      componentProps: { product }
    });

    if (success) this.getCategorias();
  }

  navigateToServiceOptions(tipoId: number) {
    this.router.navigate(['/service-options', tipoId]);
  }

  selectCategory(categoryId: string | null) {
    if (categoryId !== null) {
      this.selectedCategory = categoryId;
      this.tipos = this.tipoService.getTiposByCategory(categoryId);
      this.categorias.forEach(category => category.active = category.id === categoryId);
    }
  }

  async presentDeleteAlert(product: Category) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la categoría ${product.name}?`,
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
            this.deleteCategory(product);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteCategory(product: Category) {
    let path = `users/${this.user().uid}/products/${product.id}`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.products = this.products.filter(p => p.id !== product.id);

      this.utilSvc.presentToast({
        message: 'Producto eliminado',
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
}
