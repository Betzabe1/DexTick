import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { CategoryItemComponent } from './category-item/category-item.component';
import { TipoCardComponent } from './tipo-card/tipo-card.component';
import { FormRegistroComponent } from './form-registro/form-registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrioridadComponent } from './prioridad/prioridad.component';
import { OtroProblemComponent } from './otro-problem/otro-problem.component';
import { OptionsComponent } from './options/options.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { EditarUsariosComponent } from './editar-usarios/editar-usarios.component';
import { AddUpdateProductComponent } from './add-update-product/add-update-product.component';
import { AddUpdateSubcategoryComponent } from './add-update-subcategory/add-update-subcategory.component';
import { AddUpdateServiceComponent } from './add-update-service/add-update-service.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SearchComponent,
    CategoryItemComponent,
    TipoCardComponent,
    FormRegistroComponent,
    PrioridadComponent,
    OtroProblemComponent,
    OptionsComponent,
    PerfilesComponent,
    EditarUsariosComponent,
    AddUpdateProductComponent,
    AddUpdateSubcategoryComponent,
    AddUpdateServiceComponent
  ],
  exports:[
    HeaderComponent,
    SearchComponent,
    CategoryItemComponent,
    TipoCardComponent,
    FormsModule,
    FormRegistroComponent,
    PrioridadComponent,
    OtroProblemComponent,
    OptionsComponent,
    PerfilesComponent,
    EditarUsariosComponent,
    AddUpdateProductComponent,
    AddUpdateSubcategoryComponent,
    AddUpdateServiceComponent


  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
