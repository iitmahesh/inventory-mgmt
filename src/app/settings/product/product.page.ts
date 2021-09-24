import { ProductsListPage } from './products-list/products-list.page';
import { AddProductPage } from './add-product/add-product.page';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  addProduct = AddProductPage;
  productsList = ProductsListPage;
  constructor() { }

  ngOnInit() {
  }

}
