import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { ModalController } from '@ionic/angular';
import { AddUpdateSubcategoryComponent } from 'src/app/components/add-update-subcategory/add-update-subcategory.component';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AddUpdateProductComponent } from 'src/app/components/add-update-product/add-update-product.component';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { TipoService } from 'src/app/services/tipo.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-tipo-card',
  templateUrl: './tipo-card.component.html',
  styleUrls: ['./tipo-card.component.scss'],
})
export class TipoCardComponent {
  @Input() item!: Category;
  @Output() tipoSelected = new EventEmitter<{ action: string, id: string }>();



  onSelect() {
    this.tipoSelected.emit({ action: 'navigate', id: this.item.id });
  }

  categorias: any[] = [];
  selectedCategory: any = null;
  tipos: any[] = [];
  loading: boolean = false;

  utilSvc = inject(UtilService);
  firebaseSvc = inject(UserService);

  user(): User {
    return this.utilSvc.getFormLocalStorage('user');
  }

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private tipoService: TipoService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    this.categorias = []; // Reiniciar categorías
    let path = `users/${this.user().uid}/categorias`;
    let sub = this.firebaseSvc.getCollectionDat(path).subscribe({
      next: (res: any) => {
        this.categorias = res;
        if (this.categorias.length > 0) {
          this.selectCategory(this.categorias[0]); // Seleccionar la primera categoría automáticamente
        }
        // Cargar subcategorías para cada categoría
        this.categorias.forEach(category => {
          category.subcategorias = []; // Inicializar array de subcategorías
          this.loadSubcategories(category.id).then(subcategories => {
            category.subcategorias = subcategories;
            if (category === this.selectedCategory) {
              this.selectedCategory.subcategorias = subcategories;
            }
          });
        });
        sub.unsubscribe();
      }
    });
  }

  async loadSubcategories(categoryId: string): Promise<any[]> {
    let path = `users/${this.user().uid}/categorias/${categoryId}/subcategorias`;
    return new Promise((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionDat(path).subscribe({
        next: (res: any) => {
          resolve(res);
          sub.unsubscribe();
        },
        error: (err) => {
          reject(err);
          sub.unsubscribe();
        }
      });
    });
  }

  async addUpdateProduct(categoria?: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const modal = await this.modalCtrl.create({
      component: AddUpdateProductComponent,
      componentProps: { categoria }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.success) {
        this.loadCategories();
      }
    });

    await modal.present();
  }

  async addUpdateSubcategory(categoryId: string, subcategoria?: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const modal = await this.modalCtrl.create({
      component: AddUpdateSubcategoryComponent,
      componentProps: { categoryId, subcategoria }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.success) {
        this.loadCategories();
      }
    });

    await modal.present();
  }

  async presentDeleteAlert(categoria: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la categoría ${categoria.name}?`,
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
            this.deleteCategory(categoria);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentDeleteSubcategoryAlert(categoryId: string, subcategoria: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la subcategoría ${subcategoria.name}?`,
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
            this.deleteSubcategory(categoryId, subcategoria);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteCategory(categoria: any) {
    let path = `users/${this.user().uid}/categorias/${categoria.id}`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(categoria.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.categorias = this.categorias.filter(p => p.id !== categoria.id);

      this.utilSvc.presentToast({
        message: 'Categoría eliminada',
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
        position: 'bottom',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  async deleteSubcategory(categoryId: string, subcategoria: any) {
    let path = `users/${this.user().uid}/categorias/${categoryId}/subcategorias/${subcategoria.id}`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(subcategoria.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.categorias.forEach(categoria => {
        if (categoria.id === categoryId) {
          categoria.subcategorias = categoria.subcategorias.filter(s => s.id !== subcategoria.id);
        }
      });

      this.utilSvc.presentToast({
        message: 'Subcategoría eliminada',
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
        position: 'bottom',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.categorias.forEach(cat => cat.active = false); // Desactivar todas las categorías
    category.active = true; // Activar la categoría seleccionada
    this.selectedCategory.subcategorias = category.subcategorias; // Asegurarse de que las subcategorías se actualicen
  }

  navigateToServiceOptions(subcategoryId: string) {
    // Lógica para navegar a la página de opciones de servicio
    this.router.navigate(['/service-options', subcategoryId]);
  }

  async doRefresh(event: any) {
    await this.loadCategories();
    event.target.complete();
  }
}
