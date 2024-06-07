import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketsUserPageRoutingModule } from './tickets-user-routing.module';

import { TicketsUserPage } from './tickets-user.page';
import { HomeUserPageModule } from '../home-user/home-user.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketsUserPageRoutingModule,
    HomeUserPageModule,
    ComponentsModule,



  ],
  declarations: [TicketsUserPage]
})
export class TicketsUserPageModule {}
