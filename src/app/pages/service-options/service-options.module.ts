import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceOptionsPageRoutingModule } from './service-options-routing.module';

import { ServiceOptionsPage } from './service-options.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceOptionsPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [ServiceOptionsPage]
})
export class ServiceOptionsPageModule {}
