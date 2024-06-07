import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsAdminPage } from './tabs-admin.page';

const routes: Routes = [
  {
    path: '',
    component: TabsAdminPage,
    children: [
      {
        path: 'home-admin',
        loadChildren: () => import('../home-admin/home-admin.module').then(m => m.HomeAdminPageModule)
      },
      {
        path: 'tickets-user',
        loadChildren: () => import('../tickets-user/tickets-user.module').then(m => m.TicketsUserPageModule)
      },
      {
        path: 'perfil-admin',
        loadChildren: () => import('../perfil-admin/perfil-admin.module').then( m => m.PerfilAdminPageModule)
      },
      {
        path: '',
        redirectTo: 'home-admin',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsAdminPageRoutingModule {}
