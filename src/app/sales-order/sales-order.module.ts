import { SalesOrderDetailsPageModule } from './sales-order-details/sales-order-details.module';
import { AddSalesOrderPageModule } from './add-sales-order/add-sales-order.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesOrderPageRoutingModule } from './sales-order-routing.module';

import { SalesOrderPage } from './sales-order.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesOrderPageRoutingModule,
    AddSalesOrderPageModule,
    SalesOrderDetailsPageModule,
    SuperTabsModule
  ],
  declarations: [SalesOrderPage]
})
export class SalesOrderPageModule {}
