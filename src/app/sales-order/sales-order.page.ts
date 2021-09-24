import { Component, OnInit } from '@angular/core';
import { AddSalesOrderPage } from './add-sales-order/add-sales-order.page';
import { SalesOrderDetailsPage } from './sales-order-details/sales-order-details.page';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.page.html',
  styleUrls: ['./sales-order.page.scss'],
})
export class SalesOrderPage implements OnInit {

  addOrderSales = AddSalesOrderPage;
  salesOrderDetails = SalesOrderDetailsPage;
  constructor() { }

  ngOnInit() {
  }

}
