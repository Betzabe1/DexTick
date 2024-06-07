import { Component, Input, OnInit } from '@angular/core';
import { Options } from 'src/app/models/options-service.model';
import { OptionsServiceService } from 'src/app/services/options-service.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  @Input() tipoId!: number;
  options: Options[] = [];

  constructor(private optionsService: OptionsServiceService) {}

  ngOnInit() {
    if (this.tipoId) {
      this.options = this.optionsService.getOptionsByTipoServ(this.tipoId);
    }
  }
}
