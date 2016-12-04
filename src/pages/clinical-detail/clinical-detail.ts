import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.detailObject =this.navParams.get('info');
    // console.log(this.detailObject);
  }

  ionViewDidLoad() {
    // console.log('Hello ClinicalDetailPage Page');
  }

}
