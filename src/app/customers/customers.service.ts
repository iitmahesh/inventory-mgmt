import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private afStore: AngularFirestore) { }

  getCustomersDetails(){
    return this.afStore.collection('customers_summary_table').snapshotChanges();
  }
}
