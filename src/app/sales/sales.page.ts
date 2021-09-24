import { Component, OnInit } from '@angular/core';
import { AddSalesPage } from './add-sales/add-sales.page';
import { SalesDetailsPage } from './sales-details/sales-details.page';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {

  addSales = AddSalesPage;
  salesDetails = SalesDetailsPage;
  constructor() { }

  ngOnInit() {
  }

}
