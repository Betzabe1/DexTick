import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Category } from 'src/app/models/category.model';
import { Tipo } from 'src/app/models/tipo.model';
import { TipoService } from 'src/app/services/tipo.service';
@Component({
  selector: 'app-tickets-user',
  templateUrl: './tickets-user.page.html',
  styleUrls: ['./tickets-user.page.scss'],
})
export class TicketsUserPage implements OnInit {
  firstName: string = '';
  categorias: Category[] = [];
  tipos: Tipo[] = [];
  selectedCategory: number | null = 1;

  constructor(private userService: UserService, private tipoService: TipoService) { }

  ngOnInit() {
    this.loadUser();
    this.getCategorias();
    this.selectCategory(this.selectedCategory);
  }

  loadUser() {
    this.userService.getUser().subscribe(
      (res: any) => {
        const fullName = res.name;
        this.firstName = fullName.split(' ')[0];
      },
      (err: any) => {
        console.log(err);
      }
    );
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
