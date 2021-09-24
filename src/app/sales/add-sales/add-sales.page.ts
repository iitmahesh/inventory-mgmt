import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, MenuController, ToastController, Platform } from '@ionic/angular';
import { GeneralService } from 'src/app/general/general.service';
import { SettingsService } from 'src/app/settings/settings.service';
import { DatePipe } from '@angular/common';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.page.html',
  styleUrls: ['./add-sales.page.scss'],
  providers: [DatePipe]
})
export class AddSalesPage implements OnInit {

  error;
  todaysDate;
  customers = [];
  productCodes = [];
  productDescriptions = [];
  productsForCustomers = [];
  productCode;
  productDesc;
  customer;
  rate;
  payment;
  totalAmount;
  ratePerQty;
  quantityType;
  logoUrl;
  pdfObj;

  constructor(private menu: MenuController,
              private plt: Platform,
              private fileOpener: FileOpener,
              private generalService: GeneralService,
              private toastController: ToastController,
              private loadingCtrl: LoadingController,
              private settingService: SettingsService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.todaysDate = new Date().toISOString();
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

    this.getImgUrl();
  }

  openMainMenu(){
    this.menu.toggle('mainMenu');
  }

  formatAmountToCurrency(amount, form: NgForm): any{
    console.log(amount);
    if (amount !== null && amount !== undefined){
      if (amount.toString().charAt(0) === '₹'){
        const valueStr = amount.toString();
        console.log(valueStr.length);
        amount = valueStr.substr(1, valueStr.length - 1 ).replace(/,/g, '');
      }
      amount = +amount;
      this.rate = '₹' + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      console.log(this.rate);
    }
    else{
      this.rate = '₹' + 0;
    }
    this.calculateAmount(form);

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

  formatPaymentToCurrency(amount, form: NgForm): any{
    console.log(amount);
    if (amount !== null && amount !== undefined){
      if (amount.toString().charAt(0) === '₹'){
        const valueStr = amount.toString();
        console.log(valueStr.length);
        amount = valueStr.substr(1, valueStr.length - 1 ).replace(/,/g, '');
      }
      amount = +amount;
      this.payment = '₹' + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      console.log(this.rate);
    }
    else{
      this.payment = '₹' + 0;
    }
  }

  calculateAmount(form: NgForm) {
    console.log(form.value);
    let cgst = 0;
    let sgst = 0;
    let discount = 0;
    let rate = 0;
    let qty = 0;

    if (!!form.value.quantity){
      qty = +form.value.quantity;
      console.log('qty  : ' , qty);
    }
    if (!!form.value.cgst){
      cgst = form.value.cgst;
      console.log('cgst  : ' , cgst);
    }
    if (!!form.value.sgst){
      sgst = form.value.sgst;
      console.log('sgst  : ' , sgst);
    }
    if (!!form.value.discount){
      discount = form.value.discount;
      console.log('discount  : ' , discount);
    }
    if (!!form.value.rate){
      rate = this.convertRateToNumber(form.value.rate);
      console.log('rate  : ' , rate);
    }
    const newRate = (rate * qty);
    const discountedRate = newRate - (newRate * discount / 100);
    this.totalAmount = this.formatToCurrency(discountedRate  + (discountedRate * cgst / 100) + (discountedRate * sgst / 100));

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
    form.resetForm();
    this.productCodes = [];
    this.productDescriptions = [];
    this.quantityType = '';
  }

  submitSales(form: NgForm) {
    console.log(form.value);
    const rateVal = this.convertRateToNumber(this.rate);
    const amountVal = this.convertRateToNumber(this.totalAmount);
    const paymentVal = this.convertRateToNumber(this.payment);
    form.value.rate = rateVal;
    form.value.totalAmount = amountVal;
    form.value.payment = paymentVal;
    form.value.qtyWithQtyType = form.value.quantity + this.quantityType;
    form.value.quantity = +form.value.quantity;
    console.log(form.value);
    this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Adding Sales to Inventory Please Wait....',
      cssClass: 'loading-class',
      mode: 'ios'
    }).then(
      loadingele => {
        loadingele.present();
        this.generalService.submitSalesData(form.value)
        .then(
          response => {
            console.log('Added Successfully Purchase Data');
            console.log('I will show Dialog now');
            this.toastController.create(
              {
                header: 'Sucessfull',
                message: 'Add new Sales to inventory is Sucessfull.',
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
            form.resetForm();
            this.productCodes = [];
            this.productDescriptions = [];
            this.quantityType = '';
            loadingele.dismiss();
          })
          .catch(
            error => {
                console.log('Error while adding Sales Data .', error);
                this.toastController.create(
                  {
                    header: 'Failed',
                    message: 'Error While Submitting Sales Data',
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
                form.resetForm();
                this.productCodes = [];
                this.productDescriptions = [];
                this.quantityType = '';
                loadingele.dismiss();
            }
          );
      }
    );
  }

  checkProductForCustomer(customer){
    console.log('Inside checkProductForCustomer', customer);
    this.productsForCustomers.forEach(
      value => {
        if(value['productSupplier'] === customer){
          console.log('Inside checkProductForCustomer if cond  : ', value);
          this.productDescriptions.push(value['productDesc']);
        }
      }
    );
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

  checkProductForProductDesc(productdes, form: NgForm){
    console.log('Inside checkProductForProductCd', productdes);
    this.productCodes = [];
    this.productCode = '';
    this.productsForCustomers.forEach(
      value => {
        if (value['productDesc'] === productdes) {
          console.log('Inside checkProductForProductDesc if cond  : ', value);
          this.productCodes.push(value['productCode']);
          this.ratePerQty = value['ratePerQty'];
          this.quantityType = value['qtyType'];
          this.rate = this.formatToCurrency(this.ratePerQty);
          this.calculateAmount(form);
        }
      }
    );
  }

  generatePdf() {
    var docDefinition = {
      content: [
          {
            style: 'tableExample',
            table: {
              widths:[20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20 , 20, 20, 20, 10],
              body: this.getInfo(this.productCodes),
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
              },
              vLineWidth: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 1 : 0.5;
              },
              hLineColor: function (i, node) {
                return 'black';
              },
              vLineColor: function (i, node) {
                return 'black';
              },
            }
          }
      ],
      tableExample: {
        margin: [0, 5, 0, 15]
      }
  
    }
    console.log('We are inside generate PDF');
    this.pdfObj =  pdfMake.createPdf(docDefinition);
    this.download();
  }

  getProfilePicObject() {
    return {
          image : this.logoUrl,
          width: 70,
          alignment : 'left'
        };
  }

  getInfo(experiences){
    const exs = [
                [
                  {
                    rowSpan: 4,
                    colSpan: 4,
                    border: [true, true, false, true],
                    image: this.logoUrl,
                    fit:[65,80],
                    margin:[10,6,0,10]
                  },
                  '',
                  '',
                  '',
                  {
                    rowSpan: 4,
                    colSpan: 8,
                    border: [false, true, false, true],
                    text: 'TAX INVOICE',
                    bold: true,
                    fontSize: 12,
                    alignment: 'center',
                    margin:[60,18,0,0]
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    rowSpan: 1,
                    colSpan: 7,
                    border: [true, true, true, true],
                    text: 'ORIGINAL',
                    fillColor: '#ffff99',
                    bold: true,
                    fontSize: 12,
                    alignment: 'center'
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''                
                ],
                [
                  '', 
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    rowSpan: 3,
                    colSpan: 7,
                    border: [false,false,true,true],
                    text:''
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  {
                    colSpan: 12,
                    border: [true, false, true, true],
                    text: 'DEV COMPONENTS PRIVATE LTD',
                    bold: true,
                    fontSize: 12,
                    alignment:  'justify',
                    margin:[0,0,0,0]
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 4,
                    border: [true, false, true, true],
                    text: 'INVOICE NO.',
                    bold: true,
                    fontSize: 9,
                    alignment:  'center',
                    margin:[0,0,0,0]
                  },
                  '',
                  '',
                  '',
                  {
                    colSpan: 3,
                    border: [true, false, true, true],
                    text: 'DATE',
                    bold: true,
                    fontSize: 9,
                    alignment:  'center',
                    margin:[0,0,0,0]
                  } ,
                  '',
                  ''              
                ],
                [
                  {
                    colSpan: 4,
                    rowSpan: 3,
                    border: [true, false, true, true],
                    text: [  {text: 'Office:' , bold: true, fontSize: 9 },'\n #:83, 4th Cross, R.K.Layout. \n Padmanabha Nagar 2nd Stage \n BANGALORE-560070 \n PH : 080 - 42123195'],
                    fontSize: 7,
                    alignment:  'justify',
                    margin:[0,0,0,0]
                  },
                  '',
                  '',
                  '',
                  {
                    colSpan: 4,
                    rowSpan: 3,
                    border: [true, false, true, true],
                    text: [  {text: 'Works:UNIT I' , bold: true, fontSize: 9 },'\n #: 1/400, Hoody \n Near ABT Godown \n White Field Road \n BANGALORE-560048'],
                    fontSize: 7,
                    alignment:  'justify',
                    margin:[0,0,0,0]
                  },
                  '',
                  '',
                  '',
                  {
                    colSpan: 4,
                    rowSpan: 3,
                    border: [true, false, true, true],
                    text: [  {text: 'Works : UNIT II' , bold: true, fontSize: 9 },'\n Sy.no - 7/2, Site No. 29 \n Kachohalli Industrial Area, \n Magadi Road,Vishwaneedam PO \n BANGALORE-560091'],
                    fontSize: 7,
                    alignment:  'justify',
                    margin:[0,0,0,0]
                  },
                  '',
                  '',
                  '',
                  {
                    colSpan: 4,
                    rowSpan: 1,
                    border: [true, false, true, true],
                    text: '727/20-21',
                    fillColor: '#ffff99',
                    bold: true,
                    fontSize: 12,
                    alignment:  'center',
                    margin:[0,0,0,0]
                  },
                  '',
                  '',
                  '',
                  {
                    colSpan: 3,
                    rowSpan: 1,
                    border: [true, false, true, true],
                    text: this.datePipe.transform(new Date(), 'dd-MMM-yyyy'),
                    fillColor: '#ffff99',
                    fontSize: 10,
                    alignment:  'center',
                    margin:[0,0,0,0]
                  },
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    rowSpan: 1,
                    colSpan: 7,
                    border: [false,false,true,true],
                    text:''
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, true],
                    text: 'P.O.Number',
                    fillColor: '#ffff99',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 5,
                    border: [true, false, true, true],
                    text: 'MSI/20-21/1743',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  {
                    rowSpan: 1,
                    colSpan: 12,
                    border: [true,false,false,true],
                    text:''
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, true],
                    text: 'INTERNAL \n ORDER NO.',
                    fillColor: '#ffff99',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,2,0,0]
                  },
                  '',
                  {
                    colSpan: 5,
                    border: [true, false, true, true],
                    text: '1119/2020',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  {
                    colSpan: 4,
                    rowSpan: 1,
                    border: [true, false, true, true],
                    text: 'GSTIN NUMBER',
                    fillColor: '#ffff99',
                    bold: true,
                    fontSize: 10,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  {
                    colSpan: 8,
                    rowSpan: 1,
                    border: [true, false, true, true],
                    text: '29AAACD5866A1ZR',
                    bold: true,
                    fontSize: 10,
                    alignment:  'justify',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, true],
                    text: 'TRANSPORT',
                    fillColor: '#ffff99',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 5,
                    border: [true, false, true, true],
                    text: 'GMR CARGO SERVICE \n GST NO : 33APVPG0535N1ZL',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,2,0,0]
                  },
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  {
                    rowSpan: 1,
                    colSpan: 19,
                    border: [true,false,true,true],
                    text:''
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  {
                    colSpan: 12,
                    rowSpan: 7,
                    border: [true, false, true, true],
                    text: [  {text: 'DETAILS OF RECEIVER / CONSIGNEE (SHIPPED TO) \n\n' , bold: true, fontSize: 9 }, {text: 'M/S. M.S Transformers India Pvt Ltd' , bold: true, fontSize: 9 },'\n #:83, 1/512, Avinashi Main Road Neelambur - PO \n Coimbatore Tamil Nadu - 641062, India \n PH : 9750928830 / 6380963776'],
                    fontSize: 7,
                    alignment:  'justify',
                    margin:[0,0,0,0]
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    rowSpan: 1,
                    colSpan: 7,
                    border: [true,false,true,true],
                    text:''
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, true],
                    text: 'CONSIGNEE \n GSTIN NUMBER ',
                    fillColor: '#ffff99',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 5,
                    border: [true, false, true, true],
                    text: '33AAFCM1088G1ZM',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    rowSpan: 1,
                    colSpan: 7,
                    border: [true,false,true,true],
                    text:''
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, true],
                    text: 'PAN NUMBER',
                    fillColor: '#ffff99',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 5,
                    border: [true, false, true, true],
                    text: 'AAFCM1088G',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    rowSpan: 1,
                    colSpan: 7,
                    border: [true,false,true,true],
                    text:''
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, true],
                    text: 'HSN CODE',
                    fillColor: '#ffff99',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 5,
                    border: [true, false, true, true],
                    text: '85049010',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    rowSpan: 1,
                    colSpan: 7,
                    border: [true,false,true,true],
                    text:''
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  {
                    colSpan: 1,
                    border: [true, false, true, true],
                    text: 'SL. NO.',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 9,
                    border: [true, false, true, true],
                    text: 'Description of Goods ',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,10,0,0]
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, true],
                    text: 'No. & Description of Packing',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,3,0,0]
                  },
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, true],
                    text: 'Total Qty Of goods (Net)',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,6,0,0]
                  },
                  '',
                  {
                    colSpan: 1,
                    border: [true, false, true, true],
                    text: 'Unit of Qty',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,3,0,0]
                  },
                  {
                    colSpan: 1,
                    border: [true, false, true, true],
                    text: 'Rate per Unit',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,10,0,0]
                  },
                  {
                    colSpan: 3,
                    border: [true, false, true, true],
                    text: 'Total Amt In Rs',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,6,0,0]
                  },
                  '',
                  ''
                ],
                [
                  {
                    colSpan: 1,
                    border: [true, false, true, false],
                    text: '1',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 9,
                    border: [true, false, true, false],
                    text: '[2093104304510] CORE EI LAMINATION TYPE 43 \n\n PARTS OF TRANSFORMER \n ( E - 17 Boxes , I - 6 Boxes ) ',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, false],
                    text: 'Bundle',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, false],
                    text: '500',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 1,
                    border: [true, false, true, false],
                    text: 'KGS',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 1,
                    border: [true, false, true, false],
                    text: '78',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 3,
                    border: [true, false, true, false],
                    text: '39,000.00',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  ''
                ],
                [
                  {
                    colSpan: 1,
                    border: [true, false, true, false],
                    text: '2',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 9,
                    border: [true, false, true, false],
                    text: '[2093104304510] CORE EI LAMINATION TYPE 43 \n\n PARTS OF TRANSFORMER \n ( E - 17 Boxes , I - 6 Boxes ) ',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, false],
                    text: 'Bundle',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, false],
                    text: '500',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 1,
                    border: [true, false, true, false],
                    text: 'KGS',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 1,
                    border: [true, false, true, false],
                    text: '78',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 3,
                    border: [true, false, true, false],
                    text: '39,000.00',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  ''
                ],
                [
                  {
                    colSpan: 1,
                    border: [true, false, true, false],
                    text: '3',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 9,
                    border: [true, false, true, false],
                    text: '[2093104304510] CORE EI LAMINATION TYPE 43 \n\n PARTS OF TRANSFORMER \n ( E - 17 Boxes , I - 6 Boxes ) ',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, false],
                    text: 'Bundle',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 2,
                    border: [true, false, true, false],
                    text: '500',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  {
                    colSpan: 1,
                    border: [true, false, true, false],
                    text: 'KGS',
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 1,
                    border: [true, false, true, false],
                    text: '78',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  {
                    colSpan: 3,
                    border: [true, false, true, false],
                    text: '39,000.00',
                    bold: true,
                    fontSize: 8,
                    alignment:  'center',
                    margin:[0,5,0,0]
                  },
                  '',
                  ''
                ],
              ];
        experiences.forEach(experience => {
          exs.push([
            {
              colSpan: 1,
              border: [true, false, true, false],
              text: '2',
              fontSize: 8,
              alignment:  'center',
              margin:[0,5,0,0]
            },
            {
              colSpan: 9,
              border: [true, false, true, false],
              text: '[2093104304510] CORE EI LAMINATION TYPE 43 \n\n PARTS OF TRANSFORMER \n ( E - 17 Boxes , I - 6 Boxes ) ',
              bold: true,
              fontSize: 8,
              alignment:  'center',
              margin:[0,5,0,0]
            },
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            {
              colSpan: 2,
              border: [true, false, true, false],
              text: 'Bundle',
              fontSize: 8,
              alignment:  'center',
              margin:[0,5,0,0]
            },
            '',
            {
              colSpan: 2,
              border: [true, false, true, false],
              text: '500',
              fontSize: 8,
              alignment:  'center',
              margin:[0,5,0,0]
            },
            '',
            {
              colSpan: 1,
              border: [true, false, true, false],
              text: 'KGS',
              fontSize: 8,
              alignment:  'center',
              margin:[0,5,0,0]
            },
            {
              colSpan: 1,
              border: [true, false, true, false],
              text: '78',
              bold: true,
              fontSize: 8,
              alignment:  'center',
              margin:[0,5,0,0]
            },
            {
              colSpan: 3,
              border: [true, false, true, false],
              text: '39,000.00',
              bold: true,
              fontSize: 8,
              alignment:  'center',
              margin:[0,5,0,0]
            },
            '',
            ''
          ])
        });
        return exs;
  }

  getImgUrl() {
      const url = '../../../assets/icon/logo.jpg';
      this.getBase64ImageFromUrl(url).then(
        dataUrl => {
          console.log(dataUrl);
          this.logoUrl = dataUrl;
        }
      );
  }

async getBase64ImageFromUrl(imageUrl) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  download(){
    if(this.plt.is('cordova')){

    }else {
      this.pdfObj.download();
    }
  }

}
