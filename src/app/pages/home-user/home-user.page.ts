import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Category } from 'src/app/models/category.model';
import { Tipo } from 'src/app/models/tipo.model';
import { TipoService } from 'src/app/services/tipo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.page.html',
  styleUrls: ['./home-user.page.scss'],
})
export class HomeUserPage implements OnInit {
  firstName: string = '';
  categorias: Category[] = [];
  tipos: Tipo[] = [];
  selectedTipoId: number=-1;
  selectedCategory: number | null = 1;
  tipoServicioSeleccionado: number | null = null;

  constructor(
    private router:Router,
    private tipoService: TipoService,
  )
    { }

  ngOnInit() {
    this.getCategorias();
    this.selectCategory(this.selectedCategory);
  }


navigateToServiceOptions(tipoId: number) {
   this.router.navigate(['/service-options', tipoId]);
 }

  onTipoSelected(tipoId: number) {
    this.tipoServicioSeleccionado = tipoId;
  }



  getCategorias() {
    this.categorias = [
      {
        id: 1,
        label: 'Básico',
        image: 'assets/img/basico.png',
        active: false
      },
      {
        id: 2,
        label: 'Desarrollo',
        image: 'assets/img/desarrollo.png',
        active: false
      },
      {
        id: 3,
        label: 'Infraestructura',
        image: 'assets/img/infra.png',
        active: false
      }
    ];
  }

  selectCategory(categoryId: number | null) {
    if (categoryId !== null) {
      this.selectedCategory = categoryId;
      this.tipos = this.tipoService.getTiposByCategory(categoryId);
      this.categorias.forEach(category => category.active = category.id === categoryId);
    }
  }
}
