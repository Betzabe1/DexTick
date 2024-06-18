import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Tipo } from 'src/app/models/tipo.model';
import { TipoService } from 'src/app/services/tipo.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-agent',
  templateUrl: './home-agent.page.html',
  styleUrls: ['./home-agent.page.scss'],
})
export class HomeAgentPage implements OnInit {
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

