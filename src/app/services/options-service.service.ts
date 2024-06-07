import { Injectable } from '@angular/core';
import { Options } from '../models/options-service.model';
@Injectable({
  providedIn: 'root'
})
export class OptionsServiceService {
  private options : Options[] = [
    {
      id:1,
        nombre:'Wi-Fi lento',
        img:'assets/icon/wifilent.png',
      tipoServ: 1,
    },
    {
      id:2,
        nombre:'No funciona',
        img:'assets/icon/sinWifi.png',
       tipoServ: 1,
    },
    {
      id:3,
        nombre:'Wi-Fi Intermitente',
        img:'assets/icon/wifiInte.png',
      tipoServ: 1,
    },
    {
      id:4,
        nombre:'Otro',
        img:'assets/icon/otro.png',
      tipoServ: 1,
    },

    //impresora
    {
      id:5,
        nombre:'Sin toner',
        img:'assets/icon/impresora.png',
      tipoServ: 2,
    },
    {
      id:6,
        nombre:'No detecta impresora',
        img:'assets/icon/error.png',
      tipoServ: 2,
    },
    {
      id:7,
        nombre:'Escaner',
        img:'assets/icon/escaner.png',
      tipoServ: 2,
    },
    {
      id:8,
        nombre:'Otro',
        img:'assets/icon/otro.png',
      tipoServ: 2,
    },

    //correo
    {
      id:9,
        nombre:'Correo Intermitente',
        img:'assets/icon/correo.png',
      tipoServ: 3,
    },
    {
      id:10,
        nombre:'Error de incio',
        img:'assets/icon/error.png',
      tipoServ: 3,
    },
    {
      id:11,
        nombre:'Almacenamiento',
        img:'assets/icon/alma.png',
      tipoServ: 3,
    },
    {
      id:12,
        nombre:'Otro',
        img:'assets/icon/otro.png',
      tipoServ: 3,
    },

    //software
    {
      id:13,
        nombre:'¡Pide una junta!',
        img:'assets/icon/reunion.png',
      tipoServ: 5,
    },
    {
      id:14,
        nombre:'Otro',
        img:'assets/icon/otro.png',
      tipoServ: 5,
    },
    //apps
    {
      id:15,
        nombre:'¡Pide una junta!',
        img:'assets/icon/reunion.png',
      tipoServ: 6,
    },
    {
      id:16,
        nombre:'Otro',
        img:'assets/icon/otro.png',
      tipoServ: 6,
    },
    //pags
    {
      id:17,
        nombre:'¡Pide una junta!',
        img:'assets/icon/reunion.png',
      tipoServ: 7,
    },
    {
      id:18,
        nombre:'Otro',
        img:'assets/icon/otro.png',
      tipoServ: 7,
    },
    //redes
    {
      id:19,
        nombre:'Instalaciones',
        img:'assets/icon/instalaciones.png',
      tipoServ: 9,
    },
    {
      id:20,
        nombre:'Mantenimiento',
        img:'assets/icon/mantenimiento.png',
      tipoServ: 9,
    },
    {
      id:21,
        nombre:'Otro',
        img:'assets/icon/otro.png',
      tipoServ: 9,
    },

    //camaras

    {
      id:22,
        nombre:'Instalaciones',
        img:'assets/icon/camara.png',
      tipoServ: 10,
    },
    {
      id:23,
        nombre:'Mantenimiento',
        img:'assets/icon/mantenimiento.png',
      tipoServ: 10,
    },
    {
      id:24,
        nombre:'Otro',
        img:'assets/icon/otro.png',
      tipoServ: 10,
    },
  ];

 getOptionsByTipoServ(tipoServ: number): Options[] {
  return this.options.filter(option => option.tipoServ === tipoServ);
}


}

