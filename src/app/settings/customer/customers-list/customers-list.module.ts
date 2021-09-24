import { EditCustomerComponent } from './../edit-customer/edit-customer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CustomersListPage } from './customers-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [CustomersListPage]
})
export class CustomersListPageModule {}
