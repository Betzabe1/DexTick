import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-options',
  templateUrl: './service-options.page.html',
  styleUrls: ['./service-options.page.scss'],
})
export class ServiceOptionsPage implements OnInit {
  tipoId: number = 0; // Inicializado con valor por defecto

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const tipoIdParam = this.route.snapshot.paramMap.get('tipoId');
    if (tipoIdParam !== null) {
      this.tipoId = +tipoIdParam;
    } else {
      // Manejar el caso cuando tipoIdParam es null, si es necesario
      console.error('tipoId param is null');
    }
  }
}
