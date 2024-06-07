import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketsAgentPage } from './tickets-agent.page';

const routes: Routes = [
  {
    path: '',
    component: TicketsAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsAgentPageRoutingModule {}
