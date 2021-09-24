import { AddCustomerPage } from './add-customer/add-customer.page';
import { AddPurchasePage } from './../../purchase/add-purchase/add-purchase.page';
import { Component, OnInit } from '@angular/core';
import { CustomersListPage } from './customers-list/customers-list.page';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {

  addCustomer = AddCustomerPage;
  customersList = CustomersListPage;
  constructor() { }

  ngOnInit() {
  }

}
