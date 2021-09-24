import { HttpClientModule } from '@angular/common/http';
import { ProductsListPageModule } from './products-list/products-list.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { AddProductPageModule } from './add-product/add-product.module';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { EditProductComponent } from './edit-product/edit-product.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    AddProductPageModule,
    ProductsListPageModule,
    SuperTabsModule,
    HttpClientModule
  ],
  declarations: [ProductPage, EditProductComponent],
  entryComponents: [EditProductComponent]
})
export class ProductPageModule {}
