import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { LogOutComponent } from './log-out/log-out.component';
import { SearchComponent } from './search/search.component';
import { CategoryItemComponent } from './category-item/category-item.component';
import { TipoCardComponent } from './tipo-card/tipo-card.component';
import { FormRegistroComponent } from './form-registro/form-registro.component';
import { FormsModule } from '@angular/forms';
import { PrioridadComponent } from './prioridad/prioridad.component';
import { OtroProblemComponent } from './otro-problem/otro-problem.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OptionsComponent } from './options/options.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogOutComponent,
    SearchComponent,
    CategoryItemComponent,
    TipoCardComponent,
    FormRegistroComponent,
    PrioridadComponent,
    OtroProblemComponent,
    OptionsComponent
  ],
  exports:[
    HeaderComponent,
    LogOutComponent,
    SearchComponent,
    CategoryItemComponent,
    TipoCardComponent,
    FormsModule,
    FormRegistroComponent,
    PrioridadComponent,
    OtroProblemComponent,
    OptionsComponent

  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ]
})
export class ComponentsModule { }
