import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signInErrormsg: BehaviorSubject<string> = new BehaviorSubject('');
  signUpErrormsg: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private auth: AngularFireAuth, private router: Router) { }

  login(email: string, password: string, lodingEle: HTMLIonLoadingElement) {
    this.auth.signInWithEmailAndPassword(email, password).
    then(
      (resp) => {
        console.log(resp);
        lodingEle.dismiss();
        this.router.navigate(['./dashboard']);
      }
    ).
    catch(
      error => {
        console.log(error.message);
        this.signInErrormsg.next(error.message);
        lodingEle.dismiss();
      }
    );
  }

  signUp(email: string, password: string, loadingEle: HTMLIonLoadingElement) {
    this.auth.createUserWithEmailAndPassword(email, password).
    then(
      (resp) => {
        console.log(resp);
        loadingEle.dismiss();
        this.router.navigate(['/sign-in']);
      }
    ).
    catch(
      error => {
        console.log(error.message);
        this.signUpErrormsg.next(error.message);
        loadingEle.dismiss();
      }
    );
  }

  logOut() {
    return this.auth.signOut();
  }

}
