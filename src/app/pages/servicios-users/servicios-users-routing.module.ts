import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiciosUsersPage } from './servicios-users.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosUsersPageRoutingModule {}
