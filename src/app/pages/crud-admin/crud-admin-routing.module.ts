import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudAdminPage } from './crud-admin.page';

const routes: Routes = [
  {
    path: '',
    component: CrudAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudAdminPageRoutingModule {}
