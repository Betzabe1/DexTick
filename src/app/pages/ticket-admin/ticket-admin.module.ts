import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketAdminPageRoutingModule } from './ticket-admin-routing.module';

import { TicketAdminPage } from './ticket-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketAdminPageRoutingModule
  ],
  declarations: [TicketAdminPage]
})
export class TicketAdminPageModule {}
