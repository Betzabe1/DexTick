import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarUserPageRoutingModule } from './editar-user-routing.module';

import { EditarUserPage } from './editar-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarUserPageRoutingModule,
    ReactiveFormsModule,
    
  ],
  declarations: [EditarUserPage]
})
export class EditarUserPageModule {}
