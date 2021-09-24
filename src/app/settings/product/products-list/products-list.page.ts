import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { SettingsService } from '../../settings.service';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.page.html',
  styleUrls: ['./products-list.page.scss'],
})
export class ProductsListPage implements OnInit {

  error;
  productsList = [];
  temp = [];
  constructor(private productService: SettingsService, private modalCtrl: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {
      console.log('indise NgONINIT of add Product');
      this.productService.getProductDetails().subscribe(
        productDetailsArray => {
        this.productsList = productDetailsArray.map(
            productsDetails => {
                const productData: any  = productsDetails.payload.doc.data();
                console.log(productData);
                return {
                  id : productsDetails.payload.doc.id,
                    ...productData
                };
            }
          );
        console.log(this.productsList);
        this.temp = this.productsList;
        }
    );
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    console.log(val);

    // filter our data
    const temp = this.temp.filter((d) => {
      console.log(d);
      return d.productCode.toLowerCase().indexOf(val) !== -1 ||
             d.productDesc.toLowerCase().indexOf(val) !== -1  ||
             !val;
    });

    // update the rows
    this.productsList = temp;
  }

  clearInput(event){
    const val = '';

    console.log(val);
    // update the rows
    this.productsList = this.temp;
  }

  editThisProduct(product){
    console.log(product);
    this.modalCtrl.create(
      {
        component: EditProductComponent,
        componentProps: {productToEdit: product},
        mode: 'ios',
        cssClass: 'my-custom-modal-css'
      }
    ).then(
      modalEle => {
        modalEle.present();
      }
    );
  }
  deleteThisProduct(product){
    console.log(product);
    this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this product?',
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
            this.productService.deleteCustomer(product.id).then(
              result => {
                console.log('Product Deleted Sucessfully');
              }
            ).catch(
              error => {
                console.log('Error while deleting the product ', error);
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
