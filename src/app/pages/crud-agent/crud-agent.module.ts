import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrudAgentPageRoutingModule } from './crud-agent-routing.module';

import { CrudAgentPage } from './crud-agent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrudAgentPageRoutingModule
  ],
  declarations: [CrudAgentPage]
})
export class CrudAgentPageModule {}
