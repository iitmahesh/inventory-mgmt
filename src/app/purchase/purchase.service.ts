import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private afStore: AngularFirestore) { }

  getPurchaseDetails() {
    return this.afStore.collection('purchase_table').snapshotChanges();
  }
}
