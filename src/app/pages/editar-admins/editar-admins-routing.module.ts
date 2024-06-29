import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarAdminsPage } from './editar-admins.page';

const routes: Routes = [
  {
    path: '',
    component: EditarAdminsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarAdminsPageRoutingModule {}
