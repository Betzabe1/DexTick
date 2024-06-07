import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home-user',
        loadChildren: () => import('../home-user/home-user.module').then(m => m.HomeUserPageModule)
      },
      {
        path: 'tickets-user',
        loadChildren: () => import('../tickets-user/tickets-user.module').then(m => m.TicketsUserPageModule)
      },
      {
        path: 'perfil-user',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: '',
        redirectTo: 'home-user',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
