import { Injectable } from '@angular/core';
import { Tipo } from '../models/tipo.model';

@Injectable({
  providedIn: 'root'
})
export class TipoService {
  private tipos: Tipo[] = [
    //categoria basico
    {
      id: '',
      name: 'Wi-fi',
      image: 'assets/img/wi-fi.png',
      categoryId: 'basico'
    },
    {
      id: '',
      name: 'Impresora',
      image: 'assets/img/impresora.png',
      categoryId: 'basico'
    },
    {
      id: '',
      name: 'Correo',
      image: 'assets/img/correo.png',
      categoryId: 'basico'
    },

    // categoria software
    {
      id: '',
      name: 'Software ',
      image: 'assets/img/software.png',
      categoryId:'software'
    },
    {
      id: '',
      name: 'Aplicaciones',
      image: 'assets/img/apppWeb.png',
      categoryId: 'software'
    },
  
  ];

  getTiposByCategory(categoryId: string | number): Tipo[] {
    return this.tipos.filter(tipo => tipo.categoryId === categoryId);
  }


  addTipo(tipo: Tipo): void {
    this.tipos.push(tipo);
  }
}
