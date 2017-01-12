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
  specialtyList: any = [];
  specialty: string;
  currentUser: any;
  userList;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authServ: AuthServ, private viewCtrl: ViewController,
    private loadingCtrl: LoadingController, private af: AngularFire,
    private modalCtrl: ModalController, private alertCtrl: AlertController,
    private userServ: UserService, private fbServ: FirebaseService
  ) {
    this.user = "Browse as Guest";
    this.auth = false;

    this.userServ.getSpecialties()
      .then(snapshot => {
        this.specialtyList = snapshot.val();
        // console.log(this.specialtyList);
      });
    this.af.auth.subscribe(auth => {
      if (auth) {
        // console.log("Authenticated");
        this.auth = true;
        this.user = auth.auth.email;
        // console.log("user is;",this.user);
        this.userServ.getUsers()
          .then(list => {
            this.userList = list;
            // console.log("List:",list);
            this.userServ.getSingleUser(this.user)
              .then(user => {
                this.currentUser = user;
                this.specialty = this.currentUser.specialty;

              })
          })
          .catch(console.log)

      }
      else {
        this.user = "Not logged in";
        this.auth = false;
      }
    })
  }

  ionViewDidEnter() {
    // console.log("This.user:", this.user);
    if (this.user) {
      this.userServ.getSingleUser(this.user)
        .then(user => {
          if(user){
            this.currentUser = user;
          this.specialty = this.currentUser.specialty;
        }
        })
        .catch(console.log);
    }
  }

  enterLoggedIn() {
    // console.log(this.currentUser);
    this.specialty = this.currentUser.specialty;
    this.navCtrl.setRoot(Clinical);
  }

  chooseSpecialty(specialty: string) {
    this.authServ.logoutNoReload()
      .then(() => {
        console.log(this.authServ.getUser());
        this.fbServ.setNewSpecialty(specialty);
        this.specialty = specialty;
        this.auth = false;
        this.user = "Guest";
        this.navCtrl.setRoot(Clinical);
      })
      .catch(console.log);
  }

  loginUser() {
    this.authServ.loginUser(this.email, this.password)
      .then(user => {
        if (user) {
          this.IsloggedIn = user;
          if (!this.currentUser || this.currentUser.email == "") {
            this.userServ.getSingleUser(this.email)
              .then(user => {
                this.currentUser = user;
                this.specialty = this.currentUser.specialty;
                this.fbServ.setNewSpecialty(this.currentUser.specialty);
              })
          }
          this.navCtrl.setRoot(Clinical);
        }
      })
      .catch(error => {
        console.log("Login Error", error);
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
        this.userServ.loggedOutUser();
        this.currentUser = this.userServ.getUserInfo();
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
