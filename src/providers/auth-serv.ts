import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
/*
  Generated class for the AuthServ provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthServ {

  fireAuth: any;


  constructor(private af: AngularFire) {
    this.af.auth.subscribe(user => {
      if (user) {
        // console.log(user);
        this.fireAuth = user.auth;
        }
    })
  }

  loginUser(email: string, password: string) {
    return this.af.auth.login({
      email: email,
      password: password
    });
  }

  logoutUser() {
    return firebase.auth().signOut()
    .then(()=>{location.reload()})    ;
  }

  anonymousLogin() {
    return this.af.auth.login({
      provider: AuthProviders.Anonymous,
      method: AuthMethods.Anonymous
    });

  }

  getUser(){
    return this.fireAuth;
  }

  createUser(email, password){
    return this.af.auth.createUser({
      email:email,
      password:password
    })
  }

  updateUserList(email, password){

  }

  resetPassword(email: string): any {
     return firebase.auth().sendPasswordResetEmail(email); }
}
