import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterAgentsPage } from './register-agents.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterAgentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAgentsPageRoutingModule {}
