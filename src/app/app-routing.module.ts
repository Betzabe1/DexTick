import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa el AuthGuard

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'home-user',
    loadChildren: () => import('./pages/home-user/home-user.module').then( m => m.HomeUserPageModule),
    // canActivate: [AuthGuard]
  },
  {
  path: 'tabs',
  loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path:'perfil',
    loadChildren:()=> import('./pages/perfil/perfil.module').then(m=>m.PerfilPageModule)
  },
  {
    path: 'tickets-user',
    loadChildren: () => import('./pages/tickets-user/tickets-user.module').then( m => m.TicketsUserPageModule)
  },

  {
    path: 'service-options/:tipoId',
    loadChildren: () => import('./pages/service-options/service-options.module').then( m => m.ServiceOptionsPageModule)
  },
  {
    path: 'home-agent',
    loadChildren: () => import('./pages/home-agent/home-agent.module').then( m => m.HomeAgentPageModule),
    // canActivate: [AuthGuard]

  },
  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
     path: 'tabs-agent',
   loadChildren: () => import('./pages/tabs-agent/tabs-agent.module').then( m => m.TabsAgentPageModule)
   },
   {
     path: 'tabs-admin',
  loadChildren: () => import('./pages/tabs-admin/tabs-admin.module').then( m => m.TabsAdminPageModule)
   },

  {
    path: 'tickets-agent',
    loadChildren: () => import('./pages/tickets-agent/tickets-agent.module').then( m => m.TicketsAgentPageModule)
  },
  {
    path: 'perfil-agent',
    loadChildren: () => import('./pages/perfil-agent/perfil-agent.module').then( m => m.PerfilAgentPageModule)
  },
  {
    path: 'perfil-admin',
    loadChildren: () => import('./pages/perfil-admin/perfil-admin.module').then( m => m.PerfilAdminPageModule)
  },
  {
    path: 'crud-users',
    loadChildren: () => import('./pages/crud-users/crud-users.module').then( m => m.CrudUsersPageModule)
  },
  {
    path: 'editar-user/:id',
    loadChildren: () => import('./pages/editar-user/editar-user.module').then( m => m.EditarUserPageModule)
  },
  {
    path: 'crud-agent',
    loadChildren: () => import('./pages/crud-agent/crud-agent.module').then( m => m.CrudAgentPageModule)
  },
  {
    path: 'crud-admin',
    loadChildren: () => import('./pages/crud-admin/crud-admin.module').then( m => m.CrudAdminPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },

  {
    path: 'register-agents',
    loadChildren: () => import('./pages/register-agents/register-agents.module').then( m => m.RegisterAgentsPageModule)
  },
  {
    path: 'register-admin',
    loadChildren: () => import('./pages/register-admin/register-admin.module').then( m => m.RegisterAdminPageModule)
  },  {
    path: 'register-client',
    loadChildren: () => import('./pages/register-client/register-client.module').then( m => m.RegisterClientPageModule)
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
