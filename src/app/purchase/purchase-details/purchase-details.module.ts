import { IndiancurrencyModule } from './../../general/indiancurrency/indiancurrency.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PurchaseDetailsPage } from './purchase-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndiancurrencyModule
  ],
  declarations: [PurchaseDetailsPage]
})
export class PurchaseDetailsPageModule {}
