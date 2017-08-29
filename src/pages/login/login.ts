import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';

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

interface CurrentUser{
  email:string,
  specialty:string
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string = "shane_lester@hotmail.com";
  password: string;
  user: string = "";//email of user
  auth: Boolean= false;
  IsloggedIn: any = "blank";
  specialtyList: any = [];
  specialty: string;
  currentUser: CurrentUser ={email:"", specialty:""};//all of user object(email and specialty)
  userList;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authServ: AuthServ,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController, private alertCtrl: AlertController,
    private userServ: UserService, private fbServ: FirebaseService
  ) {

    this.userServ.getUsers()
    .then(users=>{
      this.userList=users;
      this.user = userServ.getUserInfo().email;
    });
  }

  ionViewDidEnter() {
    this.currentUser = this.userServ.getUserInfo();
    this.user = this.currentUser.email;
    this.auth = this.authServ.getAuth();
    const unsubscribe = firebase.auth().onAuthStateChanged((haveAuth) => {
      if (!haveAuth) {
        console.log("Not logged in ");
        this.currentUser = {email:"",specialty:""};
        this.user = this.currentUser.email;
        this.auth = false;
        unsubscribe();
      }
      else {
        console.log("Authenticated:",haveAuth);
        this.auth = true;
        this.currentUser.email = haveAuth.email;
        this.user = this.currentUser.email;
        this.specialty = this.currentUser.specialty||"";
        console.log("currentUser:", this.currentUser);
        unsubscribe();
      }
      })

    console.log("Did enter");
    if(this.specialtyList.length > 0){
      return
    }
    this.getSpecialties()
    .then(()=>{
      if(this.user){
        if(this.specialty){return}
        //get specialty- as we don't have a specialty
        let loadingShow = this.loadingCtrl.create({
          content:"Getting specialty"
        })
        loadingShow.present()
        this.userServ.getUsers()
        .then(users=>{
          this.userList = users;
          this.userServ.getSingleUser(this.user)
          .then(userObject=>{
            console.log("userObject in didEnter:",userObject);
            this.auth = true;
            this.specialty = userObject.specialty ||"";
            this.user = userObject.email || "";
            loadingShow.dismiss();
          })
        })

      }
      else{
        console.log("no user on entering");
        this.user = "";
        this.auth = false;
        this.specialty = "";
      }
      this.userServ.setCurrentUser({email:this.user, specialty: this.specialty});
      this.authServ.setAuth(this.auth);
    })

  }

  updateDetails(){
    this.userServ.setCurrentUser({email:this.user, specialty: this.specialty});
    this.authServ.setAuth(this.auth);
  }

  getSpecialties() {
    return this.userServ.getSpecialties()
      .then(snapshot => {
        this.specialtyList = snapshot.val();
        console.log(this.specialtyList);
      });
  }

  enterLoggedIn() {
    // console.log(this.currentUser);
    if (this.user) {
      this.specialty = this.currentUser.specialty;
    }

    this.navCtrl.setRoot(Clinical);
  }

  chooseSpecialty(specialty: string) {
    console.log(this.userServ.getUserInfo());
    this.fbServ.setNewSpecialty(specialty);
    this.specialty = specialty;
    this.auth = false;
    this.user = "";
    this.userServ.setUsername("");
    this.authServ.setAuth(false);
    this.navCtrl.setRoot(Clinical);
  }

  loginUser() {
    this.authServ.loginUser(this.email, this.password)
      .then(user => {
        console.log("Logged in as:", user);
        this.userServ.setUsername = user.email;
        if (user) {
          this.authServ.setAuth(true);
          this.IsloggedIn = user;
          if (!this.currentUser || this.currentUser.email == "") {
            this.userServ.getSingleUser(this.email)
              .then(user => {
                this.currentUser = user;
                this.user = user.email;
                this.auth =true;
                this.specialty = this.currentUser.specialty;
                this.fbServ.setNewSpecialty(this.currentUser.specialty);
              })
          }
          this.navCtrl.setRoot(Clinical);
        }
      })
      .catch(error => {
        console.log("Login Error", error);
        this.auth = false;
        this.showAlert("Error logging in", error);
        this.user = "";
      });
        this.authServ.setAuth(this.auth);
        this.userServ.setUsername("");
  }

  logoutUser() {
    let load = this.loadingCtrl.create({
      dismissOnPageChange: true
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
        location.reload();
      })
      .catch(() => {
        load.dismiss();
        location.reload();
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
