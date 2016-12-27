import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { ClinicalEditModalComponent } from '../../components/clinical-edit-modal/clinical-edit-modal';


/*
  Generated class for the ClinicalDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-clinical-detail',
  templateUrl: 'clinical-detail.html'
})
export class ClinicalDetailPage {
  detailObject: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public fbServ: FirebaseService, private modalCtrl: ModalController) {

    this.detailObject =this.navParams.get('info');
    this.fbServ.manageDetail("clinical", this.detailObject);
    // console.log(this.detailObject);
  }

  ionViewDidLoad() {
    // console.log('Hello ClinicalDetailPage Page');
  }

  editItem(type:string){
    // console.log("detail array is: ", this.detailObject[type]);
    let newModal = this.modalCtrl.create(ClinicalEditModalComponent,{"dataArray":this.detailObject[type], "type":type});
    newModal.onDidDismiss((item)=>{
      if(item)
      {
        console.log(item);
      }
    })
    newModal.present();

  }

}
