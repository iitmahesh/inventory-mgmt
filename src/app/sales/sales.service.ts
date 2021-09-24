import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private afStore: AngularFirestore) { }

  getSalesDetails() {
    return this.afStore.collection('sales_table').snapshotChanges();
  }
}
