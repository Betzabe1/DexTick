import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAdminPageRoutingModule } from './home-admin-routing.module';

import { HomeAdminPage } from './home-admin.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAdminPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
      path: '',
      component: HomeAdminPage
      }
    ]),
  ],
  declarations: [HomeAdminPage]
})
export class HomeAdminPageModule {}
