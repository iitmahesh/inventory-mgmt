import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router){  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(this.afAuth.currentUser);
    console.log(!!this.afAuth.currentUser);

    return this.afAuth.authState.pipe(
      take(1),
      map( user => !!user),
      tap(loggedIn  => {
        if (!loggedIn){
          console.log('Not Logged in so going out :) ');
          this.router.navigate(['']);
        }
      })
    );
  }

}
