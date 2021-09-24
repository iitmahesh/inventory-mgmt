import { AuthService } from './../auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit , OnDestroy{

  isSpinnerReq = false;
  error: string;
  passwordType = 'password';
  passwordIcon = 'eye-off';
  errorSubs: Subscription;

  constructor(private router: Router,
              private authService: AuthService,
              public  loadingController: LoadingController) { }

  ngOnInit() {
    this.errorSubs = this.authService.signInErrormsg.subscribe(
      errormsg => {
        this.error = errormsg;
      }
    );
  }

  ngOnDestroy(){
    console.log('leaving sign in page');
    if (this.errorSubs){
      console.log(this.errorSubs);
      this.errorSubs.unsubscribe();
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  signIn(form: NgForm): void{
    console.log(form.value);
    this.loadingController.create({
      spinner: 'bubbles',
      message: 'Signing In Please Wait....',
      cssClass: 'loading-class',
      mode: 'ios'
    }).then(
      loadingele => {
        loadingele.present();
        this.authService.login(form.value.email, form.value.password, loadingele);
      }
    );
  }

  goToSignUp(): void {
   this.router.navigate(['/sign-up']);
  }

}
