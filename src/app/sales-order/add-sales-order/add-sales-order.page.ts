import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { GeneralService } from 'src/app/general/general.service';
import { SettingsService } from 'src/app/settings/settings.service';

@Component({
  selector: 'app-add-sales-order',
  templateUrl: './add-sales-order.page.html',
  styleUrls: ['./add-sales-order.page.scss'],
})
export class AddSalesOrderPage implements OnInit {

  error;
  productionForm: FormGroup;
  customerProductDesc;
  customerProductCode;
  supplierProductDesc = [];
  supplierProductCode = [];
  customerQuantityType;
  supplierQuantityType = [];
  customer;
  supplier;
  suppliers = [];
  customers = [];
  productsForSuppliers = [];
  productsForCustomers = [];
  customerProductDescriptions = [];
  customerProductCodes = [];
  supplierProductDescriptions = [];
  supplierProductCodes = [];

  constructor(private settingService: SettingsService,
              private generalService: GeneralService,
              private toastController: ToastController,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {

    this.settingService.getSuppliers().subscribe(
      (suppliersResp: any) => {
        console.log(suppliersResp);
        for (const supplier of suppliersResp){
          this.suppliers.push(supplier['customerName']);
        }
        console.log(this.suppliers);
      }
    );

    this.settingService.getProductsForCustOrSupp('supplier').then(
      value => {
        console.log(value);
        value.forEach(
          val => {
            console.log(val);
            const docData = val.data();
            this.productsForSuppliers.push(docData);
          }
        );
      }
    ).catch(
      error => {
        console.log('error while getting products ', error);
      }
    );

    this.settingService.getCustomers().subscribe(
      (customersResp: any) => {
        console.log(customersResp);
        for (const customer of customersResp){
          this.customers.push(customer['customerName']);
        }
        console.log(this.customers);
      }
    );

    this.settingService.getProductsForCustOrSupp('customer').then(
      value => {
        console.log(value);
        value.forEach(
          val => {
            console.log(val);
            const docData = val.data();
            console.log(docData);
            this.productsForCustomers.push(docData);
          }
        );
      }
    ).catch(
      error => {
        console.log('error while getting products ', error);
      }
    );

    this.createNewForm();
  }

  checkProductForCustomer(customer){
    console.log('Inside checkProductForCustomer', customer);
    this.productsForCustomers.forEach(
      value => {
        if (value['productSupplier'] === customer){
          console.log('Inside checkProductForCustomer if cond  : ', value);
          this.customerProductDescriptions.push(value['productDesc']);
        }
      }
    );
  }

  checkProductForSupplier(supplier, index){
    console.log('Inside checkProductForSupplier', supplier);
    this.supplierProductDescriptions[index] = [];
    this.supplierProductDesc[index] = '';
    this.productsForSuppliers.forEach(
      value => {
        if (value['productSupplier'] === supplier){
          console.log('Inside checkProductForSupplier if cond  : ', value);
          //this.productCodes.push(value['productCode']);
          this.supplierProductDescriptions[index].push(value['productDesc']);
        }
      }
    );
  }

  checkProductDescForCustomer(productdes){
    console.log('Inside checkProductForProductCd', productdes);
    this.customerProductCodes = [];
    this.customerProductCode = '';

    this.productsForCustomers.forEach(
      value => {
        if (value['productDesc'] === productdes) {
          console.log('Inside checkProductForProductDesc if cond  : ', value);
          this.customerProductCodes.push(value['productCode']);
          this.customerQuantityType = value['qtyType'];
        }
      }
    );
  }

  checkProductDescForSupplier(productdes, index){
    console.log('Inside checkProductDescForSupplier', productdes);
    this.supplierProductCodes[index] = [];
    this.supplierQuantityType[index] = '';
    this.supplierProductCode[index] = '';
    this.productsForSuppliers.forEach(
      value => {
        if (value['productDesc'] === productdes) {
          console.log('Inside checkProductDescForSupplier if cond  : ', value);
          this.supplierProductCodes[index].push(value['productCode']);
          this.supplierQuantityType[index] = value['qtyType'];
        }
      }
    );
  }

  createNewForm(){
    this.productionForm = new FormGroup({
      salesOrderDate : new FormControl(new Date().toISOString(), Validators.required),
      customer : new FormControl('', Validators.required),
      salesOrderId : new FormControl('', Validators.required),
      customerProductDesc : new FormControl('', Validators.required),
      customerProductCode : new FormControl('', Validators.required),
      customerQuantity : new FormControl('', Validators.required),
      discount : new FormControl('', Validators.required),
      cgst : new FormControl('', Validators.required),
      sgst : new FormControl('', Validators.required),
      productInfoArray : new FormArray([
        new FormGroup({
          supplier : new FormControl('' , Validators.required),
          supplierProductDesc : new FormControl('', Validators.required),
          supplierProductCode : new FormControl('', Validators.required),
          supplierQuantity : new FormControl('', Validators.required),
        })
      ])
    });
  }

  addProductInfo(){
    console.log('Add Product Now');
    (this.productionForm.get('productInfoArray') as FormArray).push(
      new FormGroup({
        supplier : new FormControl('' , Validators.required),
        supplierProductDesc : new FormControl('', Validators.required),
        supplierProductCode : new FormControl('', Validators.required),
        supplierQuantity : new FormControl('', Validators.required),
      })
    );
  }

  deleteProductInfo(index: number){
    console.log('delete produst array');
    let productArray=(this.productionForm.get('productInfoArray') as FormArray);
    console.log(productArray);
    if(productArray.length >1){
      (this.productionForm.get('productInfoArray') as FormArray).removeAt(index);
    }
    const productInfoArray = this.productionForm.value.productInfoArray;
    console.log(productInfoArray);
    if (this.supplierProductCodes){
      this.supplierProductCodes.splice(index, 1);
    }
    if (this.supplierProductDescriptions) {
      this.supplierProductDescriptions.splice(index, 1);
    }
    if (this.supplierQuantityType) {
      this.supplierQuantityType.splice(index, 1);
    }
    if (productInfoArray){
      for (let j = 0; j < productInfoArray.length; j++) {
        this.supplierProductCode[j] = productInfoArray[j].supplierProductCode;
        this.supplierProductDesc[j] = productInfoArray[j].supplierProductDesc;
      }
    }
  }

  submitProduction(form: NgForm){
    console.log(form.value);
    this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Adding Sales Order to Inventory Please Wait....',
      cssClass: 'loading-class',
      mode: 'ios'
    }).then(
      loadingele => {
        loadingele.present();
        this.generalService.submitSalesOrderDetails(form.value)
        .then(
          response => {
            console.log('Added Successfully Purchase Data');
            console.log('I will show Dialog now');
            this.toastController.create(
              {
                header: 'Sucessfull',
                message: 'Add new Sales Order to inventory is Sucessfull.',
                buttons: ['Ok'],
                duration: 800,
                position: 'middle',
                mode: 'ios'
              }
            ).then(
              (toastEle) => {
                toastEle.present();
              }
            );
            this.resetForm(form);
            this.customerQuantityType = '';
            this.supplierQuantityType = [];
            loadingele.dismiss();
          })
          .catch(
            error => {
                console.log('Error while adding Sales Order Data .', error);
                this.toastController.create(
                  {
                    header: 'Failed',
                    message: 'Error While Submitting Sales Order Data',
                    buttons: ['Ok'],
                    duration: 800,
                    position: 'middle',
                    mode: 'ios'
                  }
                ).then(
                  (toastEle) => {
                    toastEle.present();
                  }
                );
                this.resetForm(form);
                this.customerQuantityType = '';
                this.supplierQuantityType = [];
                loadingele.dismiss();
            }
          );
      }
    );
  }

  resetForm(form: NgForm){
    form.reset();
    this.createNewForm();
  }

  get productInfoArrayObj(){
    return (<FormArray>this.productionForm.get('productInfoArray')).controls;
  }

}
