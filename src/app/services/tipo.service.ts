import { Injectable } from '@angular/core';
import { Tipo } from '../models/tipo.model';

@Injectable({
  providedIn: 'root'
})
export class TipoService {
  private tipos: Tipo[] = [
    {
      id: 1,
      title: 'Wi-fi',
      image: 'assets/img/wi-fi.png',
      categoryId: 1
    },
    {
      id: 2,
      title: 'Impresora',
      image: 'assets/img/impresora.png',
      categoryId: 1
    },
    {
      id: 3,
      title: 'Correo',
      image: 'assets/img/correo.png',
      categoryId: 1
    },
    // {
    //   id: 4,
    //   title: 'Otros',
    //   image: 'assets/img/otros.png',
    //   categoryId: 1
    // },
    // categoria2
    {
      id: 5,
      title: 'Software ',
      image: 'assets/img/software.png',
      categoryId: 2
    },
    {
      id: 6,
      title: 'Aplicaciones',
      image: 'assets/img/apppWeb.png',
      categoryId: 2
    },
    {
      id: 7,
      title: 'Páginas Web',
      image: 'assets/img/pags.png',
      categoryId: 2
    },
    // {
    //   id: 8,
    //   title: 'Otros',
    //   image: 'assets/img/otros.png',
    //   categoryId: 2
    // },

    // categoria3
    {
      id: 9,
      title: 'Redes',
      image: 'assets/img/redes.png',
      categoryId: 3
    },
    {
      id: 10,
      title: 'Cámaras',
      image: 'assets/img/camara.png',
      categoryId: 3
    },
    // {
    //   id: 11,
    //   title: 'Otros',
    //   image: 'assets/img/otros.png',
    //   categoryId: 3
    // },
  ];

  getTiposByCategory(categoryId: number): Tipo[] {
    return this.tipos.filter(tipo => tipo.categoryId === categoryId);
  }
}
