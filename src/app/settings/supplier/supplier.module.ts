import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { HttpClientModule } from '@angular/common/http';
import { SuppliersListPageModule } from './suppliers-list/suppliers-list.module';
import { AddSupplierPageModule } from './add-supplier/add-supplier.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplierPageRoutingModule } from './supplier-routing.module';

import { SupplierPage } from './supplier.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    SupplierPageRoutingModule,
    AddSupplierPageModule,
    SuppliersListPageModule,
    SuperTabsModule,
    IonicSelectableModule
  ],
  declarations: [SupplierPage, EditSupplierComponent],
  entryComponents: [EditSupplierComponent]
})
export class SupplierPageModule {}
