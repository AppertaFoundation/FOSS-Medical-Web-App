import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


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
  password:string = "Mylogin02100";
  user:string ="";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authServ:AuthServ, private viewCtrl: ViewController) {
       }

  ionViewDidEnter() {
    console.log('ionViewDidEnter LoginPage');
    let userDetails = this.authServ.getUser();
    if (userDetails){
      console.log("userDetails:", userDetails);
      if(userDetails.isAnonymous){
        this.user = "Anonymous";
      }
      else{
        this.user = userDetails.email;
      }
    }
    else{
      this.user = "Not logged in";
    }
    console.log(this.user);
  }

  loginUser(){
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
