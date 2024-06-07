import { Component } from '@angular/core';

@Component({
  selector: 'app-prioridad',
  templateUrl: './prioridad.component.html',
  styleUrls: ['./prioridad.component.scss'],
})
export class PrioridadComponent {
  toggleAccordion() {
    const content = document.querySelector('.accordion-content');
    if (content) {
      content.classList.toggle('expanded');
    }
  }
}
