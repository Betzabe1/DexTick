import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilAgentPageRoutingModule } from './perfil-agent-routing.module';

import { PerfilAgentPage } from './perfil-agent.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilAgentPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PerfilAgentPage]
})
export class PerfilAgentPageModule {}
