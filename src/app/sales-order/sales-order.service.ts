import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  constructor(private afStore: AngularFirestore) { }

  getSalesOrderDetails() {
    return this.afStore.collection('sales_order_table').snapshotChanges();
  }
}
