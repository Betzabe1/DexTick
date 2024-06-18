import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilAdminPageRoutingModule } from './perfil-admin-routing.module';

import { PerfilAdminPage } from './perfil-admin.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilAdminPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [PerfilAdminPage]
})
export class PerfilAdminPageModule {}
