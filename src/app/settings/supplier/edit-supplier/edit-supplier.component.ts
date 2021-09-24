import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.scss'],
})
export class EditSupplierComponent implements OnInit {
  @Input() suppDataToEdit: any;
  error;
  cityList;
  stateList;
  citiesList;
  citySelected;
  stateSelected;
  country = 'India';
  custName;
  addLine1;
  addLine2;
  zip;
  phoneNum;
  gstNum;
  emailId;

  constructor(private settingService: SettingsService,
              private loadingCtrl: LoadingController,
              private toastController: ToastController,
              private modalCtrl: ModalController,
              private http: HttpClient) { }

ngOnInit() {
 console.log(this.suppDataToEdit);
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
        this.getSelectedState(this.suppDataToEdit.state);
        this.getSelectedCity(this.suppDataToEdit.city);
    }
  );

 this.custName = this.suppDataToEdit.customerName;
 this.addLine1 = this.suppDataToEdit.addressLine1;
 this.addLine2 = this.suppDataToEdit.addressLine2;
 this.phoneNum = this.suppDataToEdit.phone;
 this.gstNum = this.suppDataToEdit.gstNumber;
 this.zip = this.suppDataToEdit.zipCode;
 this.emailId = this.suppDataToEdit.email;
}

updateSupplier(form: NgForm){
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
  console.log(form.value);
  this.loadingCtrl.create({
    spinner: 'bubbles',
    message: 'Updating Supplier Please Wait....',
    cssClass: 'loading-class',
    mode: 'ios',
    animated: true
  }).then(
    (loadingEle) => {
    loadingEle.present();
    this.settingService.updateSupplier(form.value, this.suppDataToEdit.id).then(
    response => {
      console.log('Update Successfully Supplier Data');
      console.log('I will show toast msg now now');
      this.toastController.create(
        {
          header: 'Sucessfull',
          message: 'Update Supplier Sucessfull.',
          buttons: ['Ok'],
          duration: 2000,
          position: 'middle',
          animated: true,
          mode: 'ios'
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
    console.log('Error while Updating Suppliers Data .', error);
    this.toastController.create(
      {
        header: 'Failed',
        message: 'Error While Submitting Suppliers Data',
        buttons: ['Ok'],
        duration: 2000,
        position: 'middle',
        animated: true,
        mode: 'ios'
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

resetFormData(form: NgForm): void{
  console.log(form.value);
  form.reset();
  form.resetForm();
}

  closeModal(){
    this.modalCtrl.dismiss();
  }

  getSelectedState(stateName){
    console.log(stateName);
    this.stateList.forEach(
      data => {
        if (data.name === stateName) {
          this.stateSelected = data;
          console.log(this.stateSelected);
          this.getCitiesForStateSelected(this.stateSelected.state_code);
        }
      }
    );
  }

  getCitiesForStateSelected(selectedStateCd){
    console.log(selectedStateCd);
    this.cityList = this.citiesList.filter(
      city => {
        return city.state_code === selectedStateCd;
      }
    );
    console.log(this.cityList);
  }

  getSelectedCity(cityName){
    console.log(cityName);
    this.cityList.forEach(
      data => {
        if (data.name === cityName) {
          this.citySelected = data;
          console.log(this.citySelected);
        }
      }
    );
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
        this.error.push('Please Enter Valid Email.  ');
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
