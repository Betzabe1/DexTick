import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceOptionsPage } from './service-options.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceOptionsPageRoutingModule {}
