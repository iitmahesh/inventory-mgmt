import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit, OnDestroy {

  isSpinnerReq = false;
  error: string;
  passwordType = 'password';
  passwordIcon = 'eye-off';
  errorSubs: Subscription;

  constructor(private authService: AuthService,
              public  loadingController: LoadingController) { }

  ngOnInit() {
    this.errorSubs = this.authService.signUpErrormsg.subscribe(
      errormsg => {
        this.error = errormsg;
      }
    );
  }

  ngOnDestroy(){
    console.log('leaving signup page');
    if (this.errorSubs){
      console.log(this.errorSubs);
      this.errorSubs.unsubscribe();
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  signUp(form: NgForm): void{
    console.log(form.value);
    this.loadingController.create({
      spinner: 'bubbles',
      message: 'Signing In Please Wait....',
      cssClass: 'loading-class',
      mode: 'ios'
    }).then(
      loadingele => {
        loadingele.present();
        this.authService.signUp(form.value.email, form.value.password, loadingele);
      }
    );
  }

}
