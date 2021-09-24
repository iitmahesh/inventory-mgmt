import { Component, OnInit } from '@angular/core';
import { SalesService } from '../sales.service';

@Component({
  selector: 'app-sales-details',
  templateUrl: './sales-details.page.html',
  styleUrls: ['./sales-details.page.scss'],
})
export class SalesDetailsPage implements OnInit {

  dataToBeShown = [];
  loadingIndicator = true;
  temp = [];
  selected = [];

  constructor(private salesService: SalesService) { }

  ngOnInit() {
    this.salesService.getSalesDetails().subscribe(
      salesDetailsArray => {
       this.dataToBeShown = salesDetailsArray.map(
           salesDetails => {
               const salesData: any  = salesDetails.payload.doc.data();
               console.log(salesData);
               return {
                 id : salesDetails.payload.doc.id,
                  ...salesData
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

  displayCheck(row) {
    return row.name !== 'Ethel Price';
  }

  clearInput(event){
    const val = '';

    console.log(val);
    // update the rows
    this.dataToBeShown = this.temp;
  }

}
