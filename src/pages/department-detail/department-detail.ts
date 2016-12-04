import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the ClinicalDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-department-detail',
  templateUrl: 'department-detail.html'
})
export class DepartmentDetailPage {
  detailObject: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.detailObject =this.navParams.get('info').data;
    // console.log("object is ",this.detailObject);
  }



  ionViewDidLoad() {
    // console.log('Hello DepartmentDetailPage Page');
  }

}
