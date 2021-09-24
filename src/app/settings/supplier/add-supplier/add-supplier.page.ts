import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.page.html',
  styleUrls: ['./add-supplier.page.scss'],
})
export class AddSupplierPage implements OnInit {

  error;
  country = 'India';
  stateList;
  citiesList;
  cityList;
  citySelected;
  stateSelected;
  constructor(private settingService: SettingsService,
              private loadingCtrl: LoadingController,
              private toastController: ToastController,
              private http: HttpClient ) { }

  ngOnInit() {
    this.http.get('../../../../assets/json/cities.json').subscribe(
      cities => {
        this.citiesList = cities;
        console.log(this.citiesList);
      }
    );
    this.http.get('../../../../assets/json/states.json').subscribe(
      states => {
        this.stateList = states;
        console.log(this.stateList);
      }
    );
  }

  addSupplier(form: NgForm){
    console.log(form.value);
    console.log(this.citySelected.name);
    console.log(this.stateSelected.name);
    form.value.city = this.citySelected.name;
    form.value.state = this.stateSelected.name;
    if (this.stateSelected.name.toLowerCase() === 'karnataka' ){
      console.log('We are in Karnataka ');
      form.value.isIgstReq = false;
    }else{
      console.log('We are not in Karnataka ');
      form.value.isIgstReq = true;
    }
    this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Adding Supplier Please Wait....',
      cssClass: 'loading-class',
    }).then(
      (loadingEle) => {
        loadingEle.present();
        this.settingService.addSupplier(form.value).then(
          response => {
            console.log('Added Successfully Supplier Data');
            console.log('I will show toast msg now now');
            this.toastController.create(
              {
                header: 'Sucessfull',
                message: 'Add New Supplier is Sucessfull.',
                buttons: ['Ok'],
                duration: 2000,
                position: 'middle',
                animated: true
              }
            ).then(
              (toastEle) => {
                toastEle.present();
              }
            );
            form.reset();
            form.resetForm();
            loadingEle.dismiss();
          }
        ).catch(
          error => {
            console.log('Error while adding Supplier Data .', error);
            this.toastController.create(
              {
                header: 'Failed',
                message: 'Error While Submitting Supplier Data',
                buttons: ['Ok'],
                duration: 2000,
                position: 'middle',
                animated: true
              }
            ).then(
              (toastEle) => {
                toastEle.present();
              }
            );
            form.reset();
            form.resetForm();
            loadingEle.dismiss();
          }
        );
      }
    );
  }

  resetFormData(form: NgForm){
    console.log(form.value);
    form.reset();
    form.resetForm();
  }

  selectCities(stateSelected){
    console.log(stateSelected.value.state_code);
    const stateCd = stateSelected.value.state_code;
    this.cityList = this.citiesList.filter(
      city => {
        return city.state_code === stateCd;
      }
    );
    console.log(this.cityList);
  }

  validateForm(form: NgForm){
    console.log(form);
    this.error = [];
    if (form.controls.addressLine1.touched && form.controls.addressLine1.status === 'INVALID'){
      this.error.push('Please Enter Address Line 1 its mandatory.  ');
    }
    if (form.controls.addressLine2.touched && form.controls.addressLine2.status === 'INVALID'){
      this.error.push('Please Enter Address Line 2 its mandatory.  ');
    }
    if (form.controls.customerName.touched && form.controls.customerName.status === 'INVALID'){
      this.error.push('Please Enter Customer Name its mandatory.  ');
    }
    if (form.controls.gstNumber.touched && form.controls.gstNumber.status === 'INVALID'){
      this.error.push('Please Enter GST Number its mandatory.  ');
    }
    if (form.controls.phone.touched && form.controls.phone.status === 'INVALID') {
      if (form.controls.phone.errors.pattern){
        this.error.push('Please Enter Valid Phone Number.  ');
      }else{
        this.error.push('Please Enter Phone Number its mandatory.  ');
      }
    }
    if (form.controls.email.touched && form.controls.email.status === 'INVALID') {
      if (form.controls.email.errors.pattern){
        this.error.push('Please Enter Valid Email Id.  ');
      }else{
        this.error.push('Please Enter Email Id its mandatory.  ');
      }
    }
    if (form.controls.zipCode.touched && form.controls.zipCode.status === 'INVALID'){
      if (form.controls.zipCode.errors.pattern){
        this.error.push('Please Enter Valid Zipcode.  ');
      }else{
        this.error.push('Please Enter Zipcode its mandatory.  ');
      }
    }
    if (this.error.length > 0){
      this.toastController.create(
        {
          header: 'Error',
          message: this.error.toString(),
          buttons: ['Ok'],
          duration: 2000,
          position: 'top',
          animated: true,
          mode: 'ios',
          color: 'danger'
        }
      ).then(
        toastEle => {
          toastEle.present();
        }
      );
    }
    console.log(this.error);
  }

}
