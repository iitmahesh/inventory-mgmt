import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, LoadingController } from '@ionic/angular';
import { SettingsService } from 'src/app/settings/settings.service';
import { GeneralService } from './../../general/general.service';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.page.html',
  styleUrls: ['./add-purchase.page.scss'],
})
export class AddPurchasePage implements OnInit {

  error;
  suppliers = [];
  productCodeList = [];
  productDescriptionList = [];
  productsForSuppliers = [];
  supplier;
  ratePerQuantity = [];
  payment;
  totalAmount;
  noOfQty = [];
  quantityType = [];
  cgst = [];
  sgst = [];
  igst = [];
  prodDescSelected = [];
  prodCodeSelected = [];
  isIgstReq = false;
  suppMap = new Map();
  addPurchaseForm;

  constructor(private menu: MenuController,
              private generalService: GeneralService,
              private toastController: ToastController,
              private loadingCtrl: LoadingController,
              private settingService: SettingsService) { }

  ngOnInit() {
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

    this.createNewForm();
  }

  createNewForm(){
    this.addPurchaseForm = new FormGroup({
      purchaseDate : new FormControl(new Date().toISOString(), Validators.required),
      supplier : new FormControl('', Validators.required),
      invoiceNumber : new FormControl('', Validators.required),
      productInfoArray : new FormArray([
        new FormGroup({
          productDesc : new FormControl('' , Validators.required),
          productCode : new FormControl('', Validators.required),
          quantity : new FormControl('', Validators.required),
          rate : new FormControl('', Validators.required),
          cgst : new FormControl('', []),
          sgst : new FormControl('', []),
          igst : new FormControl('', [])
        })
      ]),
      discount : new FormControl('', Validators.required),
      totalAmount : new FormControl('', Validators.required),
      payment : new FormControl('', Validators.required)
    });
  }

  get productInfoArrayObj(){
    return (<FormArray>this.addPurchaseForm.get('productInfoArray')).controls;
  }

  addProductInfo(){
    console.log('Add Product Now');
    console.log(this.productDescriptionList);
    (this.addPurchaseForm.get('productInfoArray') as FormArray).push(
      new FormGroup({
        productDesc : new FormControl('' , Validators.required),
        productCode : new FormControl('', Validators.required),
        quantity : new FormControl('', Validators.required),
        rate : new FormControl('', Validators.required),
        cgst : new FormControl('', []),
        sgst : new FormControl('', []),
        igst : new FormControl('', [])
      })
    );
  }

  deleteProductInfo(form: NgForm, index: number){
    console.log('delete produst array');
    const productArray = (this.addPurchaseForm.get('productInfoArray') as FormArray);
    console.log(productArray);
    if (productArray.length > 1 ){
      (this.addPurchaseForm.get('productInfoArray') as FormArray).removeAt(index);
      const productInfoArray = this.addPurchaseForm.value.productInfoArray;
      console.log(productInfoArray);
      if (this.productCodeList[index]){
        console.log(this.productCodeList);
        this.productCodeList.splice(index, 1);
        console.log(this.productCodeList);
      }
      if (this.prodCodeSelected[index]) {
        console.log(this.prodCodeSelected);
        this.prodCodeSelected.splice(index, 1);
        console.log(this.prodCodeSelected);
      }
      if (this.prodDescSelected[index]) {
        console.log(this.prodDescSelected);
        this.prodDescSelected.splice(index, 1);
        console.log(this.prodDescSelected);
      }
      if (this.quantityType[index]) {
        console.log(this.quantityType);
        this.quantityType.splice(index, 1);
        console.log(this.quantityType);
      }
      if (this.noOfQty[index]){
        console.log(this.noOfQty);
        this.noOfQty.splice(index, 1);
        console.log(this.noOfQty);
      }
      if (this.ratePerQuantity[index]){
        console.log(this.ratePerQuantity);
        this.ratePerQuantity.splice(index, 1);
        console.log(this.ratePerQuantity);
      }
      if (productInfoArray){
        this.calculateTotalAmount(form);
      }
   }
  }

  formatToCurrency(amount): string{
    console.log(amount);
    if (amount !== null && amount !== undefined){
      if (amount.toString().charAt(0) === '₹'){
        const valueStr = amount.toString();
        console.log(valueStr.length);
        amount = valueStr.substr(1, valueStr.length - 1 ).replace(/,/g, '');
      }
      amount = +amount;
      return '₹' + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    else{
      return '₹' + 0;
    }
  }

  formatPaymentToCurrency(form: NgForm): any{
    let amount = form.value.payment;
    console.log(amount);
    if (amount !== null && amount !== undefined){
      if (amount.toString().charAt(0) === '₹'){
        const valueStr = amount.toString();
        console.log(valueStr.length);
        amount = valueStr.substr(1, valueStr.length - 1 ).replace(/,/g, '');
      }
      amount = +amount;
      this.payment = '₹' + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      console.log(this.ratePerQuantity[0]);
    }
    else{
      this.payment = '₹' + 0;
    }
  }

  calculateTotalAmount(form: NgForm){
    console.log(form.value);
    if (form.value.productInfoArray){
      const productArr = form.value.productInfoArray;
      let totalCalcAmount = 0;
      const discount = form.value.discount;
      for (const prod of productArr) {
        console.log(prod);
        console.log('Total Calc Amount : ', totalCalcAmount);
        let cgst = 0;
        let sgst = 0;
        let igst = 0;
        let rate = 0;
        let qty = 0;
        if (!!prod.quantity){
          qty = +prod.quantity;
          console.log('qty  : ' , qty);
        }
        if (!!prod.cgst){
          cgst = +prod.cgst;
          console.log('cgst  : ' , cgst);
        }
        if (!!prod.sgst){
          sgst = +prod.sgst;
          console.log('sgst  : ' , sgst);
        }
        if (!!prod.igst){
          igst = +prod.igst;
          console.log('igst  : ' , igst);
        }
        if (!!prod.rate){
          rate = this.convertRateToNumber(prod.rate);
          console.log('rate  : ' , rate);
        }
        const newRate = (rate * qty);
        console.log('New Rate : ', newRate);
        if (this.isIgstReq){
          totalCalcAmount = totalCalcAmount + (newRate  +  (newRate * igst / 100));
        }
        else {
          totalCalcAmount = totalCalcAmount + (newRate  + (newRate * cgst / 100) + (newRate * sgst / 100));
        }
        console.log('Total Cal Amount : ', totalCalcAmount);
      }
      const discountedRate = totalCalcAmount - (totalCalcAmount * discount / 100);
      this.totalAmount = this.formatToCurrency(discountedRate);
    }
  }

  convertRateToNumber(value ): number {
    if (value !== undefined && value !== null) {
      console.log(value);
      if (value.toString().charAt(0) === '₹'){
        const valueStr = value.toString();
        console.log(valueStr.length);
        return +valueStr.substr(1, valueStr.length - 1 ).replace(/,/g, '');
      } else {
        return +value.toString().replace(/,/g, '');
      }
    } else {
      return 0;
    }
  }

  resetFormData(form: NgForm): void{
    form.reset();
   // form.resetForm();
    this.productCodeList = [];
    this.productDescriptionList = [];
    this.quantityType = [];
  }

  submitPurchase(form: NgForm) {
    console.log(form.value);
    const amountVal = this.convertRateToNumber(this.totalAmount);
    const paymentVal = this.convertRateToNumber(this.payment);
    form.value.totalAmount = amountVal;
    form.value.payment = paymentVal;
    let i = 0;
    for (const prod of form.value.productInfoArray){
      const qty = this.convertRateToNumber(prod.quantity);
      const rateValue = this.convertRateToNumber(prod.rate);
      const cgst = prod.cgst;
      const sgst = prod.sgst;
      const igst = prod.igst;
      form.value.productInfoArray[i].quantity = qty;
      form.value.productInfoArray[i].rate = rateValue;
      if (!!cgst){
        form.value.productInfoArray[i].cgst = cgst;
      }else{
        form.value.productInfoArray[i].cgst = 0;
      }
      if (!!sgst){
        form.value.productInfoArray[i].sgst = sgst;
      }else{
        form.value.productInfoArray[i].sgst = 0;
      }
      if (!!igst){
        form.value.productInfoArray[i].igst = igst;
      }else{
        form.value.productInfoArray[i].igst = 0;
      }
      i++;
    }
    console.log(form.value);
    this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Adding Product to Inventory Please Wait....',
      cssClass: 'loading-class',
      mode: 'ios'
    }).then(
      loadingele => {
        loadingele.present();
        this.generalService.submitPurchaseData(form.value)
        .then(
          response => {
            console.log('Added Successfully Purchase Data');
            console.log('I will show Dialog now');
            this.toastController.create(
              {
                header: 'Sucessfull',
                message: 'Add new product to inventory is Sucessfull.',
                buttons: ['Ok'],
                duration: 500,
                position: 'middle',
                mode: 'ios'
              }
            ).then(
              (toastEle) => {
                toastEle.present();
              }
            );
            form.reset();
            //form.resetForm();
            this.productCodeList = [];
            this.productDescriptionList = [];
            this.quantityType = [];
            loadingele.dismiss();
          })
          .catch(
            error => {
                console.log('Error while adding Purchase Data .', error);
                this.toastController.create(
                  {
                    header: 'Failed',
                    message: 'Error While Submitting Purchase Data',
                    buttons: ['Ok'],
                    duration: 500,
                    position: 'middle',
                    mode: 'ios'
                  }
                ).then(
                  (toastEle) => {
                    toastEle.present();
                  }
                );
                form.reset();
                //form.resetForm();
                this.productCodeList = [];
                this.productDescriptionList = [];
                this.quantityType = [];
                loadingele.dismiss();
            }
          );
      }
    );
  }

  checkProductForSupplier(supplier){
    console.log('Inside checkProductForSupplier', supplier);
    this.productDescriptionList = [];
    this.prodDescSelected = [];
    this.ratePerQuantity = [];
    this.quantityType = [];
    this.noOfQty = [];
    this.cgst = [];
    this.igst = [];
    this.sgst = [];
    this.productsForSuppliers.forEach(
      value => {
        if (value['productSupplier'] === supplier){
          console.log('Inside checkProductForSupplier if cond  : ', value);
          //this.productCodes.push(value['productCode']);
          this.productDescriptionList.push(value['productDesc']);        }
      }
    );
    this.checkIfIgstRequired(supplier);
  }

  /*checkProductForProductCd(productCd){
    console.log('Inside checkProductForProductCd', productCd);
    this.productDescriptions = [];
    this.productDesc = '';
    this.productsForSuppliers.forEach(
      value => {
        if (value['productCode'] === productCd) {
          console.log('Inside checkProductForProductCd if cond  : ', value);
          this.productDescriptions.push(value['productDesc']);
        }
      }
    );
  }*/

  checkProductForProductDesc(form: NgForm, index){
    const productdes = form.value.productInfoArray[index].productDesc;
    let ratePerQtyForCalc = 0;
    console.log(index);
    console.log('Inside checkProductForProductCd', form.value.productInfoArray[index].productDesc);
    this.productCodeList[index] = [];
    this.prodDescSelected[index] = productdes;
    this.prodCodeSelected[index] = '';
    this.productsForSuppliers.forEach(
      value => {
        if (value['productDesc'] === productdes) {
          console.log('Inside checkProductForProductDesc if cond  : ', value);
          this.productCodeList[index].push(value['productCode']);
          ratePerQtyForCalc = value['ratePerQty'];
          console.log(ratePerQtyForCalc);
          this.quantityType[index] = value['qtyType'];
          console.log(this.quantityType[index]);
          this.sgst[index] = value['sgst'];
          this.cgst[index] = value['cgst'];
          this.igst[index] = value['igst'];
          form.value.productInfoArray[index].sgst =  this.sgst[index];
          form.value.productInfoArray[index].cgst =  this.cgst[index];
          form.value.productInfoArray[index].igst =  this.igst[index];
          form.value.productInfoArray[index].rate = this.formatToCurrency(ratePerQtyForCalc);
          this.ratePerQuantity[index] = this.formatToCurrency(ratePerQtyForCalc);
          this.calculateTotalAmount(form);
        }
      }
    );
  }

  checkIfIgstRequired(supplier){
      console.log(supplier);
      if (supplier) {
      this.isIgstReq = this.suppMap.get(supplier);
      console.log(this.isIgstReq);
      }
   }

}
