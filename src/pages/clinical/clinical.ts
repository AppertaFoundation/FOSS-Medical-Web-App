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
     fbServ.getList("clinical")
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
    this.fbServ.moveItem("clinical",-1,info);
  }
  moveClinDown(info){
    this.fbServ.moveItem("clinical",1,info);
  }

  publishData(){
    this.fbServ.publishData("clinical");
  }

  localSave(){
    this.fbServ.localSave("clinical");
  }

  localLoad(){
    this.fbServ.getLocalFlag("clinical")
    .then((data)=>{
      if (!data){
        this.showAlert("Error", "No Clincal data saved locally");
        return
      }

      else{
        this.fbServ.localLoad("clinical")
       .then((data)=>{
         this.clinicalListData = data;
       })
       .catch((err)=>{
         console.warn(err);
       })
      }
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
