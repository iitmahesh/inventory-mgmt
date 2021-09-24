import { Component, OnInit } from '@angular/core';
import { CustomersService } from './customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {

  dataToBeShown = [];
  loadingIndicator = true;
  temp = [];
  selected = [];

  constructor(private customersService: CustomersService) { }

  ngOnInit() {
    this.customersService.getCustomersDetails().subscribe(
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
      return d.productDesc.toLowerCase().indexOf(val) !== -1 || d.productCode.toLowerCase().indexOf(val) !== -1  || !val;
    });

    // update the rows
    this.dataToBeShown = temp;
    // Whenever the filter changes, always go back to the first page
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
