import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAgentPageRoutingModule } from './home-agent-routing.module';

import { HomeAgentPage } from './home-agent.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAgentPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
      path: '',
      component: HomeAgentPage
      }
    ]),

  ],
  declarations: [HomeAgentPage]
})
export class HomeAgentPageModule {}
