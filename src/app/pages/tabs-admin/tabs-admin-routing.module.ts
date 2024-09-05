import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsAdminPage } from './tabs-admin.page';
import { TicketAdminPageModule } from '../ticket-admin/ticket-admin.module';

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
        path: 'ticket-admin',
        loadChildren: () => import('../ticket-admin/ticket-admin.module').then(m => m.TicketAdminPageModule)
      },
      {
        path: 'perfil-admin',
        loadChildren: () => import('../perfil-admin/perfil-admin.module').then( m => m.PerfilAdminPageModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('../usuarios/usuarios.module').then( m => m.UsuariosPageModule)
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
