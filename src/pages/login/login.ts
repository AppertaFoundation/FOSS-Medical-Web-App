import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';


import { AuthServ } from '../../providers/auth-serv';

import { Clinical } from '../clinical/clinical';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email:string = "shane_lester@hotmail.com";
  password:string;
  user:string ="";
  auth:Boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authServ:AuthServ, private viewCtrl: ViewController,
    private loadingCtrl: LoadingController
  ) {
       }

  ionViewDidEnter() {
    let userDetails = this.authServ.getUser();
    if (userDetails){
      console.log("userDetails:", userDetails);
      if(userDetails.isAnonymous){
        this.user = "Anonymous";
        this.auth = true;
      }
      else{
        this.user = userDetails.email;
        this.auth = true;
      }
    }
    else{
      this.user = "Not logged in";
      this.auth = false;
    }
    console.log(this.user);
  }

  loginUser(){
    // console.log(this.password);

    this.authServ.loginUser(this.email, this.password)
    .then(user =>{
      if(user){
        this.navCtrl.setRoot(Clinical);
      }
    })
    .catch(error =>{
      console.log("Login Error");
    });
  }

  logoutUser(){
    let load = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    load.present();
    this.authServ.logoutUser()
    .then(
      (result)=>{
        console.log("Logged out", result);
    })
  }

  anonymousLogin(){
    this.authServ.anonymousLogin()
    .then(user=>{
      if(user){
        this.navCtrl.setRoot(Clinical);
      }
    })
    .catch(()=>{
      return
    });
  }

}
