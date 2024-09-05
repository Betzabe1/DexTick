import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddUpdateProductComponent } from 'src/app/components/add-update-product/add-update-product.component';
import { AddUpdateSubcategoryComponent } from 'src/app/components/add-update-subcategory/add-update-subcategory.component';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TipoService } from 'src/app/services/tipo.service';
import { User } from 'src/app/models/user.model';
import { AddUpdateServiceComponent } from 'src/app/components/add-update-service/add-update-service.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-agent',
  templateUrl: './home-agent.page.html',
  styleUrls: ['./home-agent.page.scss'],
})
export class HomeAgentPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    empresa: new FormControl(''),
    tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl('', [Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    role: new FormControl('client'),
    image: new FormControl('') // Agregar el campo image al formulario
  });
  categorias: any[] = [];
  selectedCategory: any = null;
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
    this.loadUserData();
    this.loadCategories();
  }

  async loadUserData() {
    const user = this.user();
    if (user) {
      this.form.patchValue({
        uid: user.uid,
        email: user.email,
        empresa: user.empresa,
        tel: user.tel,
        name: user.name,
        role: user.role,
        image: user.image
      });
    }
  }
  async loadCategories() {
    this.categorias = []; // Reiniciar categorías
    let path = `categorias`;
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
    let path = `categorias/${categoryId}/subcategorias`;
    return new Promise((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionDat(path).subscribe({
        next: (res: any) => {
          let subcategories = res;
          subcategories.forEach(async (subcat: any) => {
            let servicePath = `categorias/${categoryId}/subcategorias/${subcat.id}/servicios`;
            subcat.servicios = await this.loadServices(servicePath);
          });
          resolve(subcategories);
          sub.unsubscribe();
        },
        error: (err) => {
          reject(err);
          sub.unsubscribe();
        }
      });
    });
  }

  async loadServices(path: string): Promise<any[]> {
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
    let path = `categorias/${categoria.id}`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(categoria.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(() => {
      loading.dismiss();
      this.loadCategories();
    });
  }

  async deleteSubcategory(categoryId: string, subcategoria: any) {
    let path = `categorias/${categoryId}/subcategorias/${subcategoria.id}`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(subcategoria.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(() => {
      loading.dismiss();
      this.loadCategories();
    });
  }

  selectCategory(category: any) {
    this.categorias.forEach(cat => cat.active = false); // Desactivar todas las categorías
    category.active = true; // Activar la categoría seleccionada
    this.selectedCategory = category; // Establecer la categoría seleccionada
  }

  navigateToServiceOptions(categoryId: string, subCategoryId: string) {
    console.log('Navigating to service options with categoryId:', categoryId, 'and subCategoryId:', subCategoryId);
    this.router.navigate(['/servicios-users', categoryId, subCategoryId]);
  }

  async doRefresh(event: any) {
    await this.loadCategories();
    event.target.complete();
  }

  async addUpdateService(categoryId: string, subcategoryId: string, service?: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const modal = await this.modalCtrl.create({
      component: AddUpdateServiceComponent,
      componentProps: { categoryId, subcategoryId, service }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.success) {
        this.loadCategories();
      }
    });

    await modal.present();
  }
}


