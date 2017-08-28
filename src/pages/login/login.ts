import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ModalController, AlertController } from 'ionic-angular';

import { AuthServ } from '../../providers/auth-serv';
import { UserService } from '../../providers/user-service';
import { FirebaseService } from '../../providers/firebase-service';

import { Clinical } from '../clinical/clinical';
import { ResetModalComponent } from '../../components/reset-modal/reset-modal';

import firebase from 'firebase';


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
  user: string = null;//email of user
  auth: Boolean= false;
  IsloggedIn: any = "blank";
  specialtyList: any = [];
  specialty: string;
  currentUser: any;//all of user
  userList;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authServ: AuthServ,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController, private alertCtrl: AlertController,
    private userServ: UserService, private fbServ: FirebaseService
  ) {
    const unsubscribe = firebase.auth().onAuthStateChanged((haveAuth) => {
      if (!haveAuth) {
        console.log("Not logged in ");
        this.currentUser = null;
        this.user = this.currentUser
        this.auth = false;

        unsubscribe();
      }
      else {
        console.log("Authenticated");
        this.auth = true;
        this.currentUser = haveAuth;
        this.user = this.currentUser.email;
        this.specialty = this.currentUser.specialty||null;
        console.log("currentUser:", this.currentUser);
      }
      this.userServ.setCurrentUser(this.currentUser);
      this.authServ.setAuth(this.auth);
      this.authServ.setUser(this.user);
    })


    this.getSpecialties();
    this.userServ.getUsers()
    .then(users=>{
      this.userList=users;
    });
    this.user = authServ.getUser();

    this.auth = authServ.getAuth();
  }

  ionViewDidEnter() {
    // if (this.user) {
      // console.log("did enter this.user -going for getSingleUser",this.user);
      // this.userServ.getSingleUser(this.user)
      //   .then(user => {
      //     console.log("Returned from getSingleUser with:",user);
      //     if (user) {
      //       this.currentUser = user;
      //       console.log("ionViewDidEnter user:", this.currentUser);
      //       this.specialty = this.currentUser.specialty;
      //     }
      //     else{
      //       this.user = "Not logged in";
      //       this.auth = false;
      //     }
      //   })
      //   .catch(console.log);

    // }
    console.log("Did enter");
    if(this.user){
      //get specialty
      let loadingShow = this.loadingCtrl.create({
        content:"Getting specialty"
      })
      loadingShow.present()
      this.userServ.getSingleUser(this.user)
      .then(currentUser=>{
        this.specialty = currentUser.specialty ||null;
        loadingShow.dismiss();
      })
    }
  }

  getSpecialties() {
    this.userServ.getSpecialties()
      .then(snapshot => {
        this.specialtyList = snapshot.val();
        console.log(this.specialtyList);
      });
  }

  enterLoggedIn() {
    // console.log(this.currentUser);
    if (this.currentUser) {
      this.specialty = this.currentUser.specialty;
    }

    this.navCtrl.setRoot(Clinical);
  }

  chooseSpecialty(specialty: string) {
    console.log(this.authServ.getUser());
    this.fbServ.setNewSpecialty(specialty);
    this.specialty = specialty;
    this.auth = false;
    this.user = "Guest";
    this.navCtrl.setRoot(Clinical);
  }

  loginUser() {
    this.authServ.loginUser(this.email, this.password)
      .then(user => {
        console.log("Logged in as:", user);
        this.authServ.setUser = user.email;
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
        this.showAlert("Error logging in", error);
      });
  }

  logoutUser() {
    let load = this.loadingCtrl.create({
      // dismissOnPageChange: true
    });
    load.present();
    if (!this.specialtyList) {
      this.getSpecialties();
    }
    // this.authServ.logoutNoReload()
    this.authServ.logoutUser()
      .then(
      (result) => {
        console.log("Logged out", result);
        load.dismiss();
        this.userServ.loggedOutUser();
        this.currentUser = this.userServ.getUserInfo();
      })
      .catch(() => {
        load.dismiss();
        // location.reload();
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

  showAlert(title: string, message: any) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }



}
