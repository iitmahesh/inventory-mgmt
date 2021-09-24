import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  error;
  suppliers = [];
  customers = [];
  custMap = new Map();
  suppMap = new Map();
  isIgstRequired = false;

  constructor(private settingService: SettingsService,
              private loadingCtrl: LoadingController,
              private toastController: ToastController) { }

  ngOnInit() {
    this.settingService.getCustomers().subscribe(
      (customers: any) => {
        console.log(customers);
        for (const customer of customers){
          this.customers.push(customer['customerName']);
          this.custMap.set(customer['customerName'], customer['isIgstReq']);
        }
        console.log(this.customers);
      }
    );
    this.settingService.getSuppliers().subscribe(
      (suppliersResp: any) => {
        console.log(suppliersResp);
        for (const supplier of suppliersResp){
          this.suppliers.push(supplier['customerName']);
          this.suppMap.set(supplier['customerName'], supplier['isIgstReq']);
        }
        console.log(this.suppliers);
      }
    );
  }

  addProduct(form: NgForm){
    console.log(form.value);
    this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Adding Product Please Wait....',
      cssClass: 'loading-class',
    }).then(
      (loadingEle) => {
        loadingEle.present();
        this.settingService.addProduct(form.value).then(
          response => {
            console.log('Added Product Successfull');
            console.log('I will show toast msg now now');
            this.toastController.create(
              {
                header: 'Sucessfull',
                message: 'Add New Product is Sucessfull.',
                buttons: ['Ok'],
                duration: 2000,
                position: 'middle',
                animated: true
              }
            ).then(
              (toastEle) => {
                toastEle.present();
              }
            );
            form.reset();
            form.resetForm();
            loadingEle.dismiss();
          }
        ).catch(
          error => {
            console.log('Error while adding Product Data .', error);
            this.toastController.create(
              {
                header: 'Failed',
                message: 'Error While Adding Product Data',
                buttons: ['Ok'],
                duration: 2000,
                position: 'middle',
                animated: true
              }
            ).then(
              (toastEle) => {
                toastEle.present();
              }
            );
            form.reset();
            form.resetForm();
            loadingEle.dismiss();
          }
        );
      }
    );
  }

  resetFormData(form: NgForm){
    console.log(form.value);
    form.reset();
    form.resetForm();
  }

  checkIfIgstRequired(form: NgForm){
   console.log(form.value.productSupplier);
   console.log(form.value.productFromTo);
   if (form.value.productFromTo === 'customer') {
    this.isIgstRequired = this.custMap.get(form.value.productSupplier);
    console.log(this.isIgstRequired);
   }
   if (form.value.productFromTo === 'supplier') {
    this.isIgstRequired = this.suppMap.get(form.value.productSupplier);
    console.log(this.isIgstRequired);
   }
  }

}
