import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilAgentPage } from './perfil-agent.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilAgentPageRoutingModule {}
