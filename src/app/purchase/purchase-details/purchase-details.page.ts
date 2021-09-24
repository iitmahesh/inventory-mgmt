import { PurchaseService } from './../../purchase/purchase.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.page.html',
  styleUrls: ['./purchase-details.page.scss'],
})
export class PurchaseDetailsPage implements OnInit {

  dataToBeShown = [];
  loadingIndicator = true;
  temp = [];
  selected = [];

  @ViewChild('table') table;
  constructor(private purchaseService: PurchaseService) { }

  ngOnInit() {
    this.purchaseService.getPurchaseDetails().subscribe(
      purchaseDetailsArray => {
       this.dataToBeShown = purchaseDetailsArray.map(
           purchaseDetails => {
               const purchaseData: any  = purchaseDetails.payload.doc.data();
               console.log(purchaseData);
               return {
                 id : purchaseDetails.payload.doc.id,
                  ...purchaseData
               };
           }
        );
       this.temp = this.dataToBeShown;
       this.loadingIndicator = false;
      }
   );
  }


  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    console.log(val);

    // filter our data
    const temp = this.temp.filter((d) => {
      console.log(d);
      return d.invoiceNumber.toString().indexOf(val) !== -1  ||
             d.purchaseDate.toString().indexOf(val) !== -1  ||
             d.supplier.toLowerCase().indexOf(val) !== -1  ||
             !val;
    });

    // update the rows
    this.dataToBeShown = temp;
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  update() {
    this.selected = [this.dataToBeShown[1], this.dataToBeShown[3]];
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  clearInput(event){
    const val = '';

    console.log(val);
    // update the rows
    this.dataToBeShown = this.temp;
  }
}
