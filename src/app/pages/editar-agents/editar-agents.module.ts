import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarAgentsPageRoutingModule } from './editar-agents-routing.module';

import { EditarAgentsPage } from './editar-agents.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarAgentsPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [EditarAgentsPage]
})
export class EditarAgentsPageModule {}
