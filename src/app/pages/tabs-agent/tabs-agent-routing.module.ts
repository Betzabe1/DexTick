import { PerfilAgentPage } from './../perfil-agent/perfil-agent.page';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsAgentPage } from './tabs-agent.page';

const routes: Routes = [
  {
    path: '',
    component: TabsAgentPage,
    children: [
      {
        path: 'home-agent',
        loadChildren: () => import('../home-agent/home-agent.module').then( m => m.HomeAgentPageModule)
      },
      {
        path: 'tickets-agent',
        loadChildren: () => import('../tickets-agent/tickets-agent.module').then(m => m.TicketsAgentPageModule)
      },
      {
        path: 'perfil-agent',
        loadChildren: () => import('../perfil-agent/perfil-agent.module').then( m => m.PerfilAgentPageModule),
      },
      {
        path: '',
        redirectTo: 'home-agent',
        pathMatch: 'full'
      }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsAgentPageRoutingModule {}

