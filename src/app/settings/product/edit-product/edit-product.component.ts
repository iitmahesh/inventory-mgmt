import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {

  @Input() productToEdit: any;
  error;
  suppliers = [];
  customers = [];
  prodDesc;
  prodCode;
  quantityType;
  prodFromTo;
  prodSupp;
  rtPerQty;
  sgstValue;
  cgstValue;
  igstValue;

  constructor(private settingService: SettingsService,
              private loadingCtrl: LoadingController,
              private toastController: ToastController,
              private modalCtrl: ModalController,
              private http: HttpClient) { }

ngOnInit() {
  console.log(this.productToEdit);
  this.settingService.getCustomers().subscribe(
    (customers: any) => {
      console.log(customers);
      for (const customer of customers){
        this.customers.push(customer['customerName']);
      }
      console.log(this.customers);
    }
  );
  this.settingService.getSuppliers().subscribe(
      (suppliersResp: any) => {
        console.log(suppliersResp);
        for (const supplier of suppliersResp){
          this.suppliers.push(supplier['customerName']);
        }
        console.log(this.suppliers);
      }
  );
  console.log(this.productToEdit.productSupplier);
  this.prodDesc = this.productToEdit.productDesc;
  this.prodCode = this.productToEdit.productCode;
  this.quantityType = this.productToEdit.qtyType;
  this.prodFromTo = this.productToEdit.productFromTo;
  this.rtPerQty = this.productToEdit.ratePerQty;
  this.sgstValue = this.productToEdit.sgst;
  this.cgstValue = this.productToEdit.cgst;
  this.igstValue = this.productToEdit.igst;
  setTimeout(() => {
    this.prodSupp = this.productToEdit.productSupplier;
    console.log(this.prodSupp);
  }, 500);
}

updateProduct(form: NgForm){
  console.log(form.value);
  this.loadingCtrl.create({
    spinner: 'bubbles',
    message: 'Updating Product Please Wait....',
    cssClass: 'loading-class',
    mode: 'ios',
    animated: true
  }).then(
    (loadingEle) => {
    loadingEle.present();
    this.settingService.updateProduct(form.value, this.productToEdit.id).then(
    response => {
      console.log('Update Successfully Product Data');
      console.log('I will show toast msg now now');
      this.toastController.create(
        {
          header: 'Sucessfull',
          message: 'Update Product Sucessfull.',
          buttons: ['Ok'],
          duration: 2000,
          position: 'middle',
          animated: true,
          mode: 'ios'
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
    console.log('Error while Updating Product Data .', error);
    this.toastController.create(
      {
        header: 'Failed',
        message: 'Error While Submitting Product Data',
        buttons: ['Ok'],
        duration: 2000,
        position: 'middle',
        animated: true,
        mode: 'ios'
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

resetFormData(form: NgForm): void{
  console.log(form.value);
  form.reset();
  form.resetForm();
}

  closeModal(){
    this.modalCtrl.dismiss();
  }

  validateForm(form: NgForm){
    console.log(form);
    this.error = [];
    if (form.controls.productCode.touched && form.controls.productCode.status === 'INVALID'){
      this.error.push('Please Enter Product Codeits its mandatory.  ');
    }
    if (form.controls.productDesc.touched && form.controls.productDesc.status === 'INVALID'){
      this.error.push('Please Enter Product Description its mandatory.  ');
    }
    if (form.controls.qtyType.touched && form.controls.qtyType.status === 'INVALID'){
      this.error.push('Please Enter Quantity Type its mandatory.  ');
    }
    if (form.controls.productFromTo.touched && form.controls.productFromTo.status === 'INVALID'){
      this.error.push('Please Enter Product From/To its mandatory.  ');
    }
    if (form.controls.productSupplier.touched && form.controls.productSupplier.status === 'INVALID') {
      this.error.push('Please Enter Product Supplier its mandatory.  ');
    }
    if (form.controls.ratePerQty.touched && form.controls.ratePerQty.status === 'INVALID') {
      this.error.push('Please Enter Rate per quantity its mandatory.  ');
    }
    if (form.controls.cgst.touched && form.controls.cgst.status === 'INVALID') {
      this.error.push('Please Enter CGST its mandatory.  ');
    }
    if (form.controls.sgst.touched && form.controls.sgst.status === 'INVALID') {
      this.error.push('Please Enter SGST its mandatory.  ');
    }
    if (form.controls.igst.touched && form.controls.igst.status === 'INVALID') {
      this.error.push('Please Enter IGST its mandatory.  ');
    }
    if (this.error.length > 0){
      this.toastController.create(
        {
          header: 'Error',
          message: this.error.toString(),
          buttons: ['Ok'],
          duration: 2000,
          position: 'top',
          animated: true,
          mode: 'ios',
          color: 'danger'
        }
      ).then(
        toastEle => {
          toastEle.present();
        }
      );
    }
    console.log(this.error);
  }

}
