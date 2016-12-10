import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { ClinicalDetailPage } from '../clinical-detail/clinical-detail';

@Component({
  selector: 'page-clinical',
  templateUrl: 'clinical.html'
})
export class Clinical {

  public clinicalListData;

  constructor(public navCtrl: NavController, public fbServ: FirebaseService, public alertCtrl: AlertController) {
     fbServ.getClinicalList()
     .then(data =>{
        this.clinicalListData = data;
      });
    // fbServ.getClinicalList()
    // .then((data)=>console.log(data));
  }

  showDetail(info){
    // console.log('item ', info);
    this.navCtrl.push(ClinicalDetailPage,{info:info});
  }

  moveClinUp(info){
    this.fbServ.moveClinUp(info);
  }
  moveClinDown(info){
    this.fbServ.moveClinDown(info);
  }

  saveData(){
    this.fbServ.saveClinicalData();
  }

  localSave(){
    this.fbServ.localSave("clinical");
  }

  localLoad(){
    if(!this.fbServ.clinicalDataLocal){
      this.showAlert("Error","No Clinical data saved yet");
      return
    }
     this.fbServ.localLoad("clinical")
    .then((data)=>{
      this.clinicalListData = data;
    })
    .catch((err)=>{
      console.warn(err);
    })
  }

  showAlert(title:string, message:string) {
   let alert = this.alertCtrl.create({
     title: title,
     subTitle: message,
     buttons: ['OK']
   });
   alert.present();
 }

}
