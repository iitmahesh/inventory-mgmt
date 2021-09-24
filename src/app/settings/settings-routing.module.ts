import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/settings/customer',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then( m => m.CustomerPageModule)
      },
      {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.module').then( m => m.SupplierPageModule)
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then( m => m.ProductPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
