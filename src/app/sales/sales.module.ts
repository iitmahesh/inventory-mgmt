import { SalesDetailsPageModule } from './sales-details/sales-details.module';
import { AddSalesPageModule } from './add-sales/add-sales.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesPageRoutingModule } from './sales-routing.module';

import { SalesPage } from './sales.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesPageRoutingModule,
    AddSalesPageModule,
    SalesDetailsPageModule,
    SuperTabsModule
  ],
  declarations: [SalesPage]
})
export class SalesPageModule {}
