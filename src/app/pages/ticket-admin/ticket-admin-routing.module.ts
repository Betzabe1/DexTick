import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketAdminPage } from './ticket-admin.page';

const routes: Routes = [
  {
    path: '',
    component: TicketAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketAdminPageRoutingModule {}
