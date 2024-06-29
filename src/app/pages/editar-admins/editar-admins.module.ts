import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarAdminsPageRoutingModule } from './editar-admins-routing.module';

import { EditarAdminsPage } from './editar-admins.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarAdminsPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [EditarAdminsPage]
})
export class EditarAdminsPageModule {}
