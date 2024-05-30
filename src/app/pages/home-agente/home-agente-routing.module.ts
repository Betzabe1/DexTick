import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeAgentePage } from './home-agente.page';

const routes: Routes = [
  {
    path: '',
    component: HomeAgentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAgentePageRoutingModule {}
