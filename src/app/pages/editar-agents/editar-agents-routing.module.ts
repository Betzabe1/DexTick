import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarAgentsPage } from './editar-agents.page';

const routes: Routes = [
  {
    path: '',
    component: EditarAgentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarAgentsPageRoutingModule {}
