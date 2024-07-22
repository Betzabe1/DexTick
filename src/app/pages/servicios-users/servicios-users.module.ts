import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosUsersPageRoutingModule } from './servicios-users-routing.module';

import { ServiciosUsersPage } from './servicios-users.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosUsersPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ServiciosUsersPage]
})
export class ServiciosUsersPageModule {}
