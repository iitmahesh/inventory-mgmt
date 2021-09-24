import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private afStore: AngularFirestore) { }

  submitPurchaseData(purchaseData): Promise<DocumentReference>{
    for (const prod of purchaseData.productInfoArray){
      let invData = {};
      this.checkInventoryForProduct(prod.productDesc, prod.productCode)
      .then(
        value => {
          console.log(value);
          if (value.empty) {
            invData['productCode'] = prod.productCode;
            invData['productDesc'] = prod.productDesc;
            invData['purchaseQty'] = +prod.quantity;
            invData['salesQty'] = 0;
            invData['openingQty'] = 0;
            invData['closingQty'] = invData['purchaseQty'] - invData['salesQty'];
            this.addInventoryData(invData);
          } else {
          value.forEach(
            val => {
              console.log(val);
              const id = val.id;
              const docData = val.data();
              invData = {
               ...docData
              };
              console.log(invData);
              if (!!invData) {
                const purchaseQty = +invData['purchaseQty'];
                const salesQty = +invData['salesQty'];
                invData['purchaseQty'] = +prod.quantity + purchaseQty;
                invData['salesQty'] = salesQty;
                invData['closingQty'] = invData['openingQty'] + invData['purchaseQty'] - invData['salesQty'];
                console.log(invData);
                this.updateInventoryTable(id, invData);
              } else {
                invData['productCode'] = prod.productCode;
                invData['productDesc'] = prod.productDesc;
                invData['purchaseQty'] = +prod.quantity;
                invData['salesQty'] = 0;
                invData['openingQty'] = 0;
                invData['closingQty'] = invData['purchaseQty'] - invData['salesQty'];
              }
            }
          );
         }
        }
       ).catch(
         error => {
           console.log(error);
         }
       );
      }
      this.checkSupplierSummaryTable(purchaseData.supplier, purchaseData);
      return this.afStore.collection('purchase_table').add(purchaseData);
    
  }

  submitSalesData(salesData): Promise<DocumentReference>{
    console.log(salesData);
    let invData = {};
    this.checkInventoryForProduct(salesData.productDesc, salesData.productCode)
    .then(
      value => {
        console.log(value);
        value.forEach(
          val => {
            console.log(val);
            const id = val.id;
            const docData = val.data();
            invData = {
             ...docData
            };
            console.log(invData);
            if (!!invData) {
              const salesQty = +invData['salesQty'];
              invData['openingQty'] = +invData['closingQty'] ;
              invData['salesQty'] = +salesData.quantity + salesQty;
              invData['closingQty'] = +invData['purchaseQty'] - invData['salesQty'];

              console.log(invData);
              this.updateInventoryTable(id, invData);
            }
          }
        );
      }
     ).catch(
       error => {
         console.log(error);
       }
     );
    this.checkCustomerSummaryTable(salesData.customer, salesData);
    return this.afStore.collection('sales_table').add(salesData);
  }

  submitSalesOrderDetails(salesOrderData){
    return this.afStore.collection('sales_order_table').add(salesOrderData);
  }

  deleteRowFromPurchaseTable(row){
    this.afStore.collection('purchase_table').doc(row.id).delete().then(
        result => {
            console.log(result);
        }
    )
  }

  deleteRowFromSalesTable(row){
    this.afStore.collection('sales_table').doc(row.id).delete().then(
        result => {
            console.log(result);
        }
    )
  }

 checkInventoryForProduct(productDesc: string, productCd: string) {
    console.log('Indise checkinventory for product :', productDesc , '  ', productCd );
    return this.afStore.collection('inventory_table').ref.
    where('productCode', '==', productCd).where('productDesc', '==', productDesc).get();
 }

 checkSupplierSummaryTable(supplier: string, purchaseData: any): void{
    let suppliersData = {};
    console.log('Indise suppliers summary table :', supplier );
    console.log(purchaseData);
    this.afStore.collection('suppliers_summary_table').ref.where('suppliers', '==', supplier).get()
    .then(
      value => {
        console.log(value);
        if (value.empty) {
          suppliersData['suppliers'] = purchaseData.supplier;
          suppliersData['openingBalance'] = 0;
          suppliersData['purchaseAmount'] = +purchaseData.totalAmount;
          suppliersData['paymentAmount'] = +purchaseData.payment;
          suppliersData['closingBalance'] = (suppliersData['purchaseAmount'] - suppliersData['paymentAmount']).toFixed(2);
          this.addSupplierSummaryData(suppliersData);
        } else {
          value.forEach(
          val => {
            console.log(val);
            const id = val.id;
            const docData = val.data();
            suppliersData = {
             ...docData
            };
            console.log(suppliersData);
            if (!!suppliersData) {
              const purchaseAmt = +suppliersData['purchaseAmount'];
              const paymentAmt = +suppliersData['paymentAmount'];
              const presentBalance = (+purchaseData.totalAmount) - (+purchaseData.payment);
              suppliersData['purchaseAmount'] = +purchaseData.totalAmount + purchaseAmt;
              suppliersData['paymentAmount'] = +purchaseData.payment + paymentAmt;
              suppliersData['closingBalance'] = (suppliersData['openingBalance'] + presentBalance).toFixed(2) ;
              console.log(suppliersData);
              this.updateSupplierSummaryTable(id, suppliersData);
            }
          }
        );
       }
      }
     ).catch(
       error => {
         console.log(error);
       }
     );
 }

  checkCustomerSummaryTable(customer: string, salesData): void{
    let customersData = {};
    console.log('Indise customers table :', customer );
    console.log('Sales Data is : ', salesData);
    this.afStore.collection('customers_summary_table').ref.where('customer', '==', customer).get()
    .then(
      value => {
        console.log(value);
        if (value.empty) {
          customersData['customer'] = salesData.customer;
          customersData['openingBalance'] = 0;
          customersData['salesAmount'] = +salesData.totalAmount;
          customersData['amountReceived'] = +salesData.payment;
          customersData['closingBalance'] = (customersData['salesAmount'] - customersData['amountReceived']).toFixed(2);
          this.addCustomerSummaryData(customersData);
        } else {
          value.forEach(
          val => {
            console.log(val);
            const id = val.id;
            const docData = val.data();
            customersData = {
            ...docData
            };
            console.log(customersData);
            if (!!customersData) {
              const saleAmt = +customersData['salesAmount'];
              const amtReceived = +customersData['amountReceived'];
              customersData['openingBalance'] = +customersData['closingBalance'] ;
              customersData['salesAmount'] = +salesData.amount + saleAmt;
              customersData['amountReceived'] = +salesData.payment + amtReceived;
              customersData['closingBalance'] = (customersData['salesAmount'] - customersData['amountReceived']).toFixed(2) ;

              console.log(customersData);
              this.updateCustomerSummaryTable(id, customersData);
            }
          }
        );
      }
     }
    ).catch(
      error => {
        console.log(error);
      }
    );
  }

  addInventoryData(data){
      this.afStore.collection('inventory_table').add(data)
      .then(
        res => {
          console.log('Data Successfully Added to Inventory Table ', res);
        }
      ).catch(
        error => {
          console.log(error);
        }
      );
  }

  addSupplierSummaryData(data){
    this.afStore.collection('suppliers_summary_table').add(data)
    .then(
      res => {
        console.log('Data Successfully Added to supplier summary Table ', res);
      }
    ).catch(
      error => {
        console.log(error);
      }
    );
  }

  addCustomerSummaryData(data){
    this.afStore.collection('customers_summary_table').add(data)
    .then(
      res => {
        console.log('Data Successfully Added to customer summary Table ', res);
      }
    ).catch(
      error => {
        console.log(error);
      }
    );
  }

  updateInventoryTable(id, data){
    console.log(id);
    console.log(data);
    this.afStore.collection('inventory_table').doc(id).update(data).
    then(
        result => {
                  console.log(result);
                }
        )
    .catch(
        error => {
                  console.log(error);
                }
    );
  }

  updateSupplierSummaryTable(id, data){
    console.log(id);
    console.log(data);
    this.afStore.collection('suppliers_summary_table').doc(id).update(data).
    then(
        result => {
                  console.log(result);
                }
        )
    .catch(
        error => {
                  console.log(error);
                }
    );
  }

  updateCustomerSummaryTable(id, data){
    console.log(id);
    console.log(data);
    this.afStore.collection('customers_summary_table').doc(id).update(data).
    then(
        result => {
                  console.log(result);
                }
        )
    .catch(
        error => {
                  console.log(error);
                }
    );
  }
}
