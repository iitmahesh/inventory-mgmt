import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private afStore: AngularFirestore) { }

  getInventoryDetails(){
    return this.afStore.collection('inventory_table').snapshotChanges();
  }
}
