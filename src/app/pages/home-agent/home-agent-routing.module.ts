import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeAgentPage } from './home-agent.page';

const routes: Routes = [
  {
    path: '',
    component: HomeAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAgentPageRoutingModule {}
