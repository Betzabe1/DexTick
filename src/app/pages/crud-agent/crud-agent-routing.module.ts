import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudAgentPage } from './crud-agent.page';

const routes: Routes = [
  {
    path: '',
    component: CrudAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudAgentPageRoutingModule {}
