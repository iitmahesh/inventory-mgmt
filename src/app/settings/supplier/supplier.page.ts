import { AddSupplierPage } from './add-supplier/add-supplier.page';
import { Component, OnInit } from '@angular/core';
import { SuppliersListPage } from './suppliers-list/suppliers-list.page';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.page.html',
  styleUrls: ['./supplier.page.scss'],
})
export class SupplierPage implements OnInit {

  addSupplier = AddSupplierPage;
  suppliersList = SuppliersListPage;
  constructor() { }

  ngOnInit() {
  }

}
