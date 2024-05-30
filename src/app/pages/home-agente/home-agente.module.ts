import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAgentePageRoutingModule } from './home-agente-routing.module';

import { HomeAgentePage } from './home-agente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAgentePageRoutingModule
  ],
  declarations: [HomeAgentePage]
})
export class HomeAgentePageModule {}
