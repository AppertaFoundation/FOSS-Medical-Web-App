import { Component } from '@angular/core';
import { AuthServ } from '../../providers/auth-serv';
import { ViewController } from 'ionic-angular';
import { EmailValidator } from '../../validators/email';

/*
  Generated class for the ResetModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'reset-modal',
  templateUrl: 'reset-modal.html'
})
export class ResetModalComponent {
  email:string;

  constructor(private authServ: AuthServ, private viewCtrl:ViewController) {
  }

  passwordReset(){
    let isValid = EmailValidator.isValidEmail(this.email);
    console.log("isValid", isValid);
    if(this.email == "shanesapps@hotmail.com"){
      return
    }
    if (isValid.invalidEmail){
      this.viewCtrl.dismiss("Enter a valid email");
      return
    }

    this.authServ.resetPassword(this.email)
    .then(()=>{
      this.viewCtrl.dismiss("Password reset email sent!");
    })
    .catch((error)=>{
      this.viewCtrl.dismiss(error);
      })


  }
  dismiss(){
    this.viewCtrl.dismiss();
  }

}
