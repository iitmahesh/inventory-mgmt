import { Component, OnInit } from '@angular/core';
import { SalesOrderService } from '../sales-order.service';

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.page.html',
  styleUrls: ['./sales-order-details.page.scss'],
})
export class SalesOrderDetailsPage implements OnInit {

  dataToBeShown = [];
  loadingIndicator = true;
  temp = [];
  selected = [];

  constructor(private salesOrderService: SalesOrderService) { }

  ngOnInit() {
    this.salesOrderService.getSalesOrderDetails().subscribe(
      salesOrderArray => {
       this.dataToBeShown = salesOrderArray.map(
           salesOrder => {
               const salesOrderData: any  = salesOrder.payload.doc.data();
               console.log(salesOrderData);
               return {
                 id : salesOrder.payload.doc.id,
                  ...salesOrderData
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
      return d.customerProductDesc.toLowerCase().indexOf(val) !== -1 ||
             d.customerProductCode.toLowerCase().indexOf(val) !== -1  ||
             d.customer.toLowerCase().indexOf(val) !== -1  ||
             d.salesOrderId.toString().indexOf(val) !== -1  ||
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
