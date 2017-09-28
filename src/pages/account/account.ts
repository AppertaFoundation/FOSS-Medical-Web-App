import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthServ } from '../../providers/auth-serv';
import { EmailValidator } from '../../validators/email'
import { UserService } from '../../providers/user-service';
import { FirebaseService } from '../../providers/firebase-service';
import 'rxjs/add/operator/toPromise';
import firebase from 'firebase';

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

  public signupForm:FormGroup;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  userList: any;
  isAuth: Boolean;
  isGuest: Boolean;
  specialties: Array<String>;
  newSpecName: String = "";
  checking: Boolean = false;
  baseSpeciality: String = "ENT";
  userName:string;
  currentUser:Object={"email":"","admin":"","specialty":""};
  user:any;

  constructor(public navCtrl: NavController, public authServ: AuthServ, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, private userServ: UserService,
    private fbServ: FirebaseService

  ) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

  //   const unsubscribe = firebase.auth().onAuthStateChanged((auth) => {
  //      if (!auth) { if (auth) {
  //          // console.log(auth);
  //          this.isAuth = true;
  //          this.userName = auth.email;
  //          // console.log("UserName = ", this.userName);
  //          // else { this.isGuest = false; }
  //          this.currentUser = this.userServ.getUserInfo() || this.currentUser;
  //          this.userServ.getSpecialties()
  //            .then(snapshot => {
  //              this.specialties = snapshot.val();
  //            });

  //          // this.specialties.subscribe((item)=>{console.log(item)});
  //        }
  //        else {
  //          this.isGuest = true;
  //          this.isAuth = false;
  //        }
  //      }
  // })
  //   // this.af.auth.subscribe(auth => {
  //   //
  //   // })


  }

  ionViewDidEnter() {
    this.isAuth = this.authServ.getAuth()
    this.user = this.userServ.getUserInfo()
    this.userServ.getSpecialties().then(
      res=>{
        this.specialties= res.val();
        console.log("Specialties:",this.specialties);
      }
    ); 
    


    this.currentUser = this.userServ.getUserDetails(this.user);
    console.log(this.currentUser);
    // console.log("Entered Accounts");
    // this.newSpecName = "";
    // this.userServ.getSingleUser(this.userName)
    // .then(obj=>{
    //   console.log(obj);
    // })
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
          // console.log("New user is:", user);
          this.userServ.addUser(this.signupForm.value.email, this.baseSpeciality, false);

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
    this.fbServ.setNewSpecialty(chosen);
  }

  addSpecialty() {
    this.checking = true;
    let blankClin = {
      "0": {
        "admin": "",
        "flags": "",
        "picture": "",
        "required": "",
        "signs": "",
        "summary": "",
        "symptoms": "",
        "title": "blank"
      }
    };

    let blankDept = {
      "0": {
        "group": "blank",
        "data": { "0": { "detail": "", "type": "" } }
      }
    };

    this.checkChosenName()
      .then(currentList => {
        console.log("CurrentList", currentList);
        if (currentList.length > 0) {
          let lenList = currentList.length;
          let hospital = this.fbServ.getDBDetails().hospital;
          console.log(currentList);
          currentList.push(this.newSpecName);
          this.specialties.push(this.newSpecName);
          let newObj ={};
          newObj[lenList] = this.newSpecName;


          firebase.database().ref().child(`${hospital}/specialties`).update(newObj);
          firebase.database().ref().child(`${hospital}/${this.newSpecName}/published/clinical`).update(blankClin);
          firebase.database().ref().child(`${hospital}/${this.newSpecName}/published/department`).update(blankDept);
          this.newSpecName = "";
        }
        this.checking = false;
      })


  }


  checkChosenName(): Promise<any> {
    let newName = [];
    let checkedName = this.newSpecName;

    return new Promise((resolve, reject) => {
      this.userServ.getSpecialties()
        .then(snapshot => {
          newName = snapshot.val();
          newName.forEach(function(childData) {
            console.log(childData);
            console.log(childData == checkedName);
            if (childData == checkedName) {
              newName = [];
            }
          });
          console.log("NewName:", newName);
          resolve (newName);
        })
        .catch((error) => {
          console.log("Error ", error);
          reject (null);
        })
    }
    )

  }

}
