import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';


import { AuthServ } from '../../providers/auth-serv';
import { UserService } from '../../providers/user-service';
import { FirebaseService } from '../../providers/firebase-service';

import { Clinical } from '../clinical/clinical';
import { ResetModalComponent } from '../../components/reset-modal/reset-modal';

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
  user: string;
  auth: Boolean;
  IsloggedIn: any = "blank";
  specialtyList: any;
  specialty: string;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authServ: AuthServ, private viewCtrl: ViewController,
    private loadingCtrl: LoadingController, private af: AngularFire,
    private modalCtrl: ModalController, private alertCtrl: AlertController,
    private userServ: UserService, private fbServ:FirebaseService
  ) {
    this.user = "Browse as Guest";
    this.auth = false;
    this.specialty = this.fbServ.getNewSpecialty();
    this.af.auth.subscribe(auth => {
      this.specialtyList = this.userServ.getSpecialties();
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

  chooseSpecialty(specialty:string){
    this.fbServ.setNewSpecialty(specialty);
    this.specialty= specialty;
  }

  loginUser() {
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
    this.navCtrl.setRoot(Clinical);
  }

  resetPassword() {
    let message = "No message"

    let resetModal = this.modalCtrl.create(ResetModalComponent);
    resetModal.onDidDismiss((response) => {
      message = response;
      this.showAlert("Completed", message)
    });

    resetModal.present();
  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }



}
