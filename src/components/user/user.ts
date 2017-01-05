import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthServ } from '../../providers/auth-serv';
import { EmailValidator } from '../../validators/email'
import { Clinical } from '../../pages/clinical/clinical';
import { FirebaseService } from '../../providers/firebase-service';
/*
  Generated class for the User component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent {

  public signupForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading;
  userList:any;

  constructor(public navCtrl: NavController, public authServ: AuthServ, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, private fbServ: FirebaseService
  ) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
    this.userList = this.fbServ.getUserList();
  }

  goToResetPassword() {
    //  this.navCtrl.push(ResetPasswordPage);
  }
  /** * Receives an input field and sets the corresponding fieldChanged * property to 'true' to help with the styles. */
  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  getUserList(){
    this.userList= this.fbServ.getUserList();
  }

  getUserDetails(email:string){
    for (let f=0; f<this.userList.length; f++){
      console.log(this.userList[f]);
      if (this.userList[f].email == email){
        return this.userList[f];
      }
    }
  }

  signupUser() {
  //   this.loading = this.loadingCtrl.create({
  //    dismissOnPageChange: true });
  // this.loading.present();
    this.submitAttempt = true;
    if (this.signupForm.valid) { console.log("not valid", this.signupForm.value); }
    else {
      this.authServ.createUser(this.signupForm.value.email, this.signupForm.value.password)
          .then((user) => {
            console.log("New user is:", user);
            this.fbServ.addUser(this.signupForm.value.email,"ENT", false,);
            this.navCtrl.setRoot(Clinical);
          })

          .catch((error)=>{
            console.log("Error in signupUser ",error);
              // this.loading.dismiss();
              let errorMessage: string = error.message;
              let alert = this.alertCtrl.create({
                 message: errorMessage,
                 buttons: [{
                   text: "Ok",
                   role: 'cancel' }]
                 });
                 alert.present();
               });

    }
  }

}
