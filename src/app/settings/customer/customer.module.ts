import { HttpClientModule } from '@angular/common/http';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { CustomersListPageModule } from './customers-list/customers-list.module';
import { AddCustomerPageModule } from './add-customer/add-customer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerPageRoutingModule } from './customer-routing.module';

import { CustomerPage } from './customer.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    CustomerPageRoutingModule,
    AddCustomerPageModule,
    CustomersListPageModule,
    SuperTabsModule,
    IonicSelectableModule
  ],
  declarations: [CustomerPage, EditCustomerComponent],
  entryComponents: [EditCustomerComponent]
})
export class CustomerPageModule {}
