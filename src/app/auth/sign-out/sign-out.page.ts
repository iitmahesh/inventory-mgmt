import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.page.html',
  styleUrls: ['./sign-out.page.scss'],
})
export class SignOutPage implements OnInit {

  constructor(private loadingCtrl: LoadingController,private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.loadingCtrl.create({
      message: 'Signing Out Please Wait',
      spinner: 'circles',
      cssClass: 'loading-class',
      mode: 'ios',
      duration: 2000
    }).then(
      loadingEle => {
        loadingEle.present();
        this.auth.signOut().then(
          data => {
            console.log('Signing Out');
            this.router.navigate(['sign-in']);
            loadingEle.dismiss();
          }
        ).catch(
          error => {
              console.log(error);
              loadingEle.dismiss();
          }
        );
      }
    ).catch(
      error => {
          console.log(error);
      }
    );
  }

}
