import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketsAgentPageRoutingModule } from './tickets-agent-routing.module';

import { TicketsAgentPage } from './tickets-agent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketsAgentPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TicketsAgentPage]
})
export class TicketsAgentPageModule {}
