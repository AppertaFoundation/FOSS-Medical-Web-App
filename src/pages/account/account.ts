import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthServ } from '../../providers/auth-serv';
import { EmailValidator } from '../../validators/email'
import { UserService } from '../../providers/user-service';
import { FirebaseService } from '../../providers/firebase-service';
import { AngularFire } from 'angularfire2';

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
  loading: any;
  isGuest: Boolean;



  constructor(public navCtrl: NavController, public authServ: AuthServ, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, private userServ: UserService,
    private fbServ: FirebaseService, private af: AngularFire

  ) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
    this.af.auth.subscribe(auth => {
      if (auth) {
        // console.log(auth);
      this.isAuth = true;
        if (auth.auth.email == "shanesapps@hotmail.com") {
          this.isGuest = true;
        }
        else{this.isGuest = false;}
      }
      else {
        this.isGuest = true;
      this.isAuth = false;
      }
    })

    this.loading = this.loadingCtrl.create({
      content: 'Checking Authentication'
    })



  }

  ionViewDidEnter() {
    // console.log("Guest?", this.isGuest);
    // console.log("Auth?", this.isAuth);
  }

  goToResetPassword() {
    //  this.navCtrl.push(ResetPasswordPage);
  }
  /** * Receives an input field and sets the corresponding fieldChanged * property to 'true' to help with the styles. */
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
          this.userServ.addUser(this.signupForm.value.email, "ENT", false, );

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

}
