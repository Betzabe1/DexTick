import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsAdminPageRoutingModule } from './tabs-admin-routing.module';

import { TabsAdminPage } from './tabs-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsAdminPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TabsAdminPage]
})
export class TabsAdminPageModule {}
