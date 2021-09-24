import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private afStore: AngularFirestore) { }

  getSuppliersDetails(){
    return this.afStore.collection('suppliers_summary_table').snapshotChanges();
  }
}
