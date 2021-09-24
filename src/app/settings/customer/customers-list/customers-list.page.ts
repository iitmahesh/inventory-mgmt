import { EditCustomerComponent } from './../edit-customer/edit-customer.component';
import { SettingsService } from 'src/app/settings/settings.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.page.html',
  styleUrls: ['./customers-list.page.scss'],
})
export class CustomersListPage implements OnInit {

  error;
  customersList = [];
  temp = [];
  constructor(private custService: SettingsService, private modalCtrl: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {
      console.log('indise NgONINIT of add Customer');
      this.custService.getCustomersDetails().subscribe(
        customerDetailsArray => {
        this.customersList = customerDetailsArray.map(
            customersDetails => {
                const customerData: any  = customersDetails.payload.doc.data();
                console.log(customerData);
                return {
                  id : customersDetails.payload.doc.id,
                    ...customerData
                };
            }
          );
        console.log(this.customersList);
        this.temp = this.customersList;
        }
    );
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    console.log(this.temp);
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
    console.log('Temp created is : ',  temp);
    this.customersList = temp;
  }

  clearInput(event){
    const val = '';

    console.log(val);
    // update the rows
    this.customersList = this.temp;
  }

  editThisCustomer(customer){
    console.log(customer);
    this.modalCtrl.create(
      {
        component: EditCustomerComponent,
        componentProps: {custDataToEdit: customer},
        mode: 'ios',
        cssClass: 'my-custom-modal-css'
      }
    ).then(
      modalEle => {
        console.log('Inside the model present ele enter', modalEle);
        modalEle.present().then(
          value => {
            console.log(value);
          }
        ).catch(
          error => {
            console.log(error);
          }
        )
        console.log('Inside the model present ele out', modalEle);
      }
    );
  }
  deleteThisCustomer(customer){
    console.log(customer);
    this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this customer?',
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
            this.custService.deleteCustomer(customer.id).then(
              result => {
                console.log('Customer Deleted Sucessfully');
              }
            ).catch(
              error => {
                console.log('Error while deleting the customer ', error);
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
