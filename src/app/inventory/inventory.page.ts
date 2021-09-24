import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  dataToBeShown = [];
  loadingIndicator = true;
  temp = [];
  selected = [];

  constructor(private inventoryService: InventoryService, private menu: MenuController) { }

  ngOnInit() {
    this.inventoryService.getInventoryDetails().subscribe(
      inventoryArray => {
       this.dataToBeShown = inventoryArray.map(
           invDetails => {
               const invData: any  = invDetails.payload.doc.data();
               console.log(invData);
               return {
                 id : invDetails.payload.doc.id,
                  ...invData
               };
           }
        );
       console.log(this.dataToBeShown);
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
