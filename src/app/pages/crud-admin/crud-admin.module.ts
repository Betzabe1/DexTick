import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrudAdminPageRoutingModule } from './crud-admin-routing.module';

import { CrudAdminPage } from './crud-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrudAdminPageRoutingModule
  ],
  declarations: [CrudAdminPage]
})
export class CrudAdminPageModule {}
