import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private afStore: AngularFirestore) { }

  addCustomer(custData){
    console.log(custData);
    return this.afStore.collection('customers_table').add(custData);
  }

  updateCustomer(data, id){
    console.log(id);
    console.log(data);
    return this.afStore.collection('customers_table').doc(id).update(data);
  }

  deleteCustomer(id){
    console.log(id);
    return this.afStore.collection('customers_table').doc(id).delete();
  }

  addSupplier(supplierData){
    console.log(supplierData);
    return this.afStore.collection('suppliers_table').add(supplierData);
  }

  updateSupplier(data, id){
    console.log(id);
    console.log(data);
    return this.afStore.collection('suppliers_table').doc(id).update(data);
  }

  deleteSupplier(id){
    console.log(id);
    return this.afStore.collection('suppliers_table').doc(id).delete();
  }

  addProduct(productData){
    console.log(productData);
    return this.afStore.collection('products_table').add(productData);
  }

  updateProduct(data, id){
    console.log(id);
    console.log(data);
    return this.afStore.collection('products_table').doc(id).update(data);
  }

  deleteProduct(id){
    console.log(id);
    return this.afStore.collection('products_table').doc(id).delete();
  }

  getCustomers(){
    return this.afStore.collection('customers_table').valueChanges();
  }

  getSuppliers(){
    return this.afStore.collection('suppliers_table').valueChanges();
  }

  getProductsForCustOrSupp(custOrSupplier: string){
    return this.afStore.collection('products_table').ref.
        where('productFromTo', '==', custOrSupplier).get();
  }

  getCustomersDetails() {
    return this.afStore.collection('customers_table').snapshotChanges();
  }

  getSuppliersDetails() {
    return this.afStore.collection('suppliers_table').snapshotChanges();
  }

  getProductDetails() {
    return this.afStore.collection('products_table').snapshotChanges();
  }
}
