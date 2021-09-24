import { IndiancurrencyModule } from './../general/indiancurrency/indiancurrency.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryPageRoutingModule } from './inventory-routing.module';

import { InventoryPage } from './inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryPageRoutingModule,
    IndiancurrencyModule
  ],
  declarations: [InventoryPage]
})
export class InventoryPageModule {}
