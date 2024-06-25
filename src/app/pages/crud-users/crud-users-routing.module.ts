import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudUsersPage } from './crud-users.page';

const routes: Routes = [
  {
    path: '',
    component: CrudUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudUsersPageRoutingModule {}
