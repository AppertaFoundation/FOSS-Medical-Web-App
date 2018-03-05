import { Injectable } from '@angular/core';
import firebase from 'firebase';
/*
  Generated class for the AuthServ provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthServ {

  fireAuth: firebase.auth.Auth;
  auth:boolean = false;
  currentUser:any;


  constructor() {
    this.fireAuth = firebase.auth();
  }

  loginUser(email: string, password: string) {
     return this.fireAuth.signInWithEmailAndPassword(email, password);
   }

  logoutUser() {
    return firebase.auth().signOut()
    .then(()=>{
      return;
      // location.reload()
    })    ;
  }

  logoutNoReload(){
    return firebase.auth().signOut()
    .then(console.log)
  }

  anonymousLogin() {
    return
    };

  setAuth(status){
    this.auth = status;
  }

  // setUser(name){
  //   console.log("Setting user:",name);
  //   this.currentUser =name;
  // }



  // getUser(){
  //   console.log("user:",this.currentUser);
  //   return this.currentUser;
  // }

  getAuth(){
    console.log("auth:", this.auth);
    return this.auth;
  }

  createUser(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
    }

  updateUserList(email, password){

  }

  resetPassword(email: string): any {
     return firebase.auth().sendPasswordResetEmail(email); }
}
