import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OptionsServiceService } from 'src/app/services/options-service.service';
import { Service } from 'src/app/models/service.model';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit, OnChanges {
  @Input() subCategoryId: string = ''; // Declarado como @Input
  services: Service[] = [];

  constructor(private optionsService: OptionsServiceService) {}

  ngOnInit() {
    this.loadServices();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['subCategoryId'] && !changes['subCategoryId'].isFirstChange()) {
      this.loadServices();
    }
  }

  loadServices() {
    if (this.subCategoryId) {
      this.optionsService.getOptionsBySubCategoryId(this.subCategoryId).subscribe(
        (services) => {
          this.services = services;
        },
        (error) => {
          console.error('Error loading services: ', error);
        }
      );
    }
  }
}
