import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from './../../models/category.model';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
})
export class CategoryItemComponent {
  @Input() item: Category;
  @Output() categorySelected = new EventEmitter<string>();

  selectCategory() {
    this.categorySelected.emit(this.item.id);
  }

  
}
