import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { ClinicalDetailPage } from '../clinical-detail/clinical-detail';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  public clinicalListData;

  constructor(public navCtrl: NavController, public fbServ: FirebaseService) {
    this.clinicalListData = fbServ.getClinicalList();
  }

  showDetail(info){
    // console.log('item ', info);
    this.navCtrl.push(ClinicalDetailPage,{info:info});
  }

}
