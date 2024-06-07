import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tipo} from 'src/app/models/tipo.model';

@Component({
  selector: 'app-tipo-card',
  templateUrl: './tipo-card.component.html',
  styleUrls: ['./tipo-card.component.scss'],
})
export class TipoCardComponent  {
  @Input() item!:Tipo;
  @Output() tipoSelected = new EventEmitter<number>();
  onSelect() {
    this.tipoSelected.emit(this.item.id);
  }
}

