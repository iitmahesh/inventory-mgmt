import { EditSupplierComponent } from './../edit-supplier/edit-supplier.component';
import { SettingsService } from 'src/app/settings/settings.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.page.html',
  styleUrls: ['./suppliers-list.page.scss'],
})
export class SuppliersListPage implements OnInit {

  error;
  suppliersList = [];
  temp = [];
  constructor(private settingsService: SettingsService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
      console.log('indise NgONINIT of add supplier');
      this.settingsService.getSuppliersDetails().subscribe(
        supplierDetailsArray => {
        this.suppliersList = supplierDetailsArray.map(
            suppliersDetails => {
                const supplierData: any  = suppliersDetails.payload.doc.data();
                console.log(supplierData);
                return {
                  id : suppliersDetails.payload.doc.id,
                    ...supplierData
                };
            }
          );
        console.log(this.suppliersList);
        this.temp = this.suppliersList;
        }
    );
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    console.log(val);

    // filter our data
    const temp = this.temp.filter((d) => {
      console.log(d);
      return d.customerName.toLowerCase().indexOf(val) !== -1 ||
             d.addressLine1.toLowerCase().indexOf(val) !== -1  ||
             d.email.toLowerCase().indexOf(val) !== -1  ||
             !val;
    });

    // update the rows
    this.suppliersList = temp;
  }

  clearInput(event){
    const val = '';

    console.log(val);
    // update the rows
    this.suppliersList = this.temp;
  }

  editThisSupplier(supplier){
    console.log(supplier);
    this.modalCtrl.create(
      {
        component: EditSupplierComponent,
        componentProps: {suppDataToEdit: supplier},
        mode: 'ios',
        cssClass: 'my-custom-modal-css'
      }
    ).then(
      modalEle => {
        modalEle.present();
      }
    );
  }

  deleteThisSupplier(supplier){
    console.log(supplier);
    this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this supplier?',
      mode: 'ios',
      animated: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes will be handled here');
            this.settingsService.deleteSupplier(supplier.id).then(
              result => {
                console.log('Supplier Deleted Sucessfully');
              }
            ).catch(
              error => {
                console.log('Error while deleting the Supplier ', error);
              }
            )

          }
        }
      ]
    }).then(
      alertEle => {
        alertEle.present();
      }
    );
  }

}
