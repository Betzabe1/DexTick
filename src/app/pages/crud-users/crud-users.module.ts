import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrudUsersPageRoutingModule } from './crud-users-routing.module';

import { CrudUsersPage } from './crud-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrudUsersPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrudUsersPage]
})
export class CrudUsersPageModule {}
