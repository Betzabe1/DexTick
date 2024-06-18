import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeUserPageRoutingModule } from './home-user-routing.module';

import { HomeUserPage } from './home-user.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeUserPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
      path: '',
      component: HomeUserPage
      }
    ]),

  ],
  declarations: [HomeUserPage]
})
export class HomeUserPageModule {}
