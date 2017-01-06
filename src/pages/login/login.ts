import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';


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
  email: string = "shane_lester@hotmail.com";
  password: string;
  user: string = "Not Logged In";
  auth: Boolean;
  IsloggedIn: any = "blank";



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authServ: AuthServ, private viewCtrl: ViewController,
    private loadingCtrl: LoadingController, private af: AngularFire) {
    this.user = "Not logged in";
    this.auth = false;
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.auth = true;
        this.user = auth.auth.email;
        if (this.user == "shanesapps@hotmail.com") {
          this.auth = false;
          this.user = "Guest";
        }
      }
      else {
        this.user = "Not logged in";
        this.auth = false;
      }
    })
  }

  ionViewDidEnter() {
  }

  loginUser() {
    // console.log(this.password);

    this.authServ.loginUser(this.email, this.password)
      .then(user => {
        if (user) {
          this.IsloggedIn = user;

          this.navCtrl.setRoot(Clinical);
        }
      })
      .catch(error => {
        console.log("Login Error");
      });
  }



  logoutUser() {
    let load = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    load.present();
    this.authServ.logoutUser()
      .then(
      (result) => {
        console.log("Logged out", result);
      })
  }

  anonymousLogin() {
    this.user = "Guest";
    this.auth = false;
    this.authServ.loginUser("shanesapps@hotmail.com", "guest1000")
      .then(user => {
        if (user) {

          this.navCtrl.setRoot(Clinical);
        }
      })
      .catch(error => {
        console.log("Login Error");
      });
  }
}
