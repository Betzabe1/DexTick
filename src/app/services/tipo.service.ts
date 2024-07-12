import { Injectable } from '@angular/core';
import { Tipo } from '../models/tipo.model';

@Injectable({
  providedIn: 'root'
})
export class TipoService {
  private tipos: Tipo[] = [
    //categoria basico
    {
      id: 1,
      title: 'Wi-fi',
      image: 'assets/img/wi-fi.png',
      categoryId: 'basico'
    },
    {
      id: 2,
      title: 'Impresora',
      image: 'assets/img/impresora.png',
      categoryId: 'basico'
    },
    {
      id: 3,
      title: 'Correo',
      image: 'assets/img/correo.png',
      categoryId: 'basico'
    },

    // categoria software
    {
      id: 5,
      title: 'Software ',
      image: 'assets/img/software.png',
      categoryId:'software'
    },
    {
      id: 6,
      title: 'Aplicaciones',
      image: 'assets/img/apppWeb.png',
      categoryId: 'software'
    },
    {
      id: 7,
      title: 'Páginas Web',
      image: 'assets/img/pags.png',
      categoryId: 'software'
    },


    // categoria hardware
    {
      id: 9,
      title: 'Redes',
      image: 'assets/img/redes.png',
      categoryId: 'hardw'
    },
    {
      id: 10,
      title: 'Cámaras',
      image: 'assets/img/camara.png',
      categoryId: 'hardw'
    },

  ];

  getTiposByCategory(categoryId: string | number): Tipo[] {
    return this.tipos.filter(tipo => tipo.categoryId === categoryId);
  }


  addTipo(tipo: Tipo): void {
    this.tipos.push(tipo);
  }
}
