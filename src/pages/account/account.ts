import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthServ } from '../../providers/auth-serv';
import { EmailValidator } from '../../validators/email'
import { UserService } from '../../providers/user-service';
import { FirebaseService } from '../../providers/firebase-service';
import { AngularFire } from 'angularfire2';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

interface Details {
  hospital: string,
  baseUrl: string,
  specialty: string
}

/*
  Generated class for the User component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  public signupForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  userList: any;
  isAuth: Boolean;
  isGuest: Boolean;
  specialties;
  newSpecName: String = "";
  checking: Boolean = false;
  baseSpeciality: String = "ENT";



  constructor(public navCtrl: NavController, public authServ: AuthServ, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, private userServ: UserService,
    private fbServ: FirebaseService, private af: AngularFire, public http: Http

  ) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
    this.af.auth.subscribe(auth => {
      if (auth) {
        // console.log(auth);
        this.isAuth = true;
        if (auth.auth.email == "shane_lester@hotmail.com") {// currently hardcoding
                  }
        // else { this.isGuest = false; }
        this.specialties = this.userServ.getSpecialties();
        // this.specialties.subscribe((item)=>{console.log(item)});
      }
      else {
        this.isGuest = true;
        this.isAuth = false;
      }
    })


  }

  ionViewDidEnter() {
    this.newSpecName = "";
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }


  signupUser() {

    this.submitAttempt = true;
    if (!this.signupForm.valid) { console.log("not valid", this.signupForm.value); }
    else {
      this.authServ.createUser(this.signupForm.value.email, this.signupForm.value.password)
        .then((user) => {
          console.log("New user is:", user);
          this.userServ.addUser(this.signupForm.value.email, this.baseSpeciality, false, );

          let alert = this.alertCtrl.create({
            message: "User created!",
            buttons: [{
              text: "Ok",
              role: 'cancel'
            }]
          });
          alert.present();

        })

        .catch((error) => {
          console.log("Error in signupUser ", error);
          // this.loading.dismiss();
          let errorMessage: string = error.message;
          let alert = this.alertCtrl.create({
            message: errorMessage,
            buttons: [{
              text: "Ok",
              role: 'cancel'
            }]
          });
          alert.present();
        });

    }
  }

  selectSpecialty(chosen) {
    this.baseSpeciality = chosen;
  }

  addSpecialty() {
    this.checking = true;
    if (this.checkChosenName) {
      let hospital = this.fbServ.getDBDetails().hospital;
      // let url = details.baseUrl;
      // let hospital = details.hospital;
      firebase.database().ref().child(`${hospital}/specialties`).update({name:this.newSpecName});
      let blankClin ={
        "0": {
          "admin": "",
          "flags": "",
          "picture": "",
          "required": "",
          "signs": "",
          "summary": "",
          "symptoms": "",
          "title": ""
        }
      };

      let blankDept ={
        "0": {
          "group": "",
          "data": { "0": { "detail": "", "type": "" } }
        }
    };
      firebase.database().ref().child(`${hospital}/${this.newSpecName}/published/clinical`).update(blankClin);
      firebase.database().ref().child(`${hospital}/${this.newSpecName}/published/department`).update(blankDept);
      this.newSpecName = "";
    }
    this.checking = false;
  }


  checkChosenName() {
    let newName = true;
    let checkedName = this.newSpecName;

    let query = this.userServ.getSpecRef().orderByKey();
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

          var childData = childSnapshot.val();
          // console.log(childData);
          // console.log(childData == checkedName);
          if (childData == checkedName) {
            newName = false;
          }
        });
        console.log("NewName:", newName);
        return newName;
      })
      .catch((error) => {
        console.log("Error ", error);
      })

  }

}
