import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/*
  Generated class for the ClinicalEditModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'clinical-edit-modal',
  templateUrl: 'clinical-edit-modal.html'
})
export class ClinicalEditModalComponent {

  info: Object;
  type:String;
  backup: Object;

  constructor(private viewCtrl:ViewController, private navParams:NavParams) {
    this.info = this.navParams.get('dataArray');
    this.type = this.navParams.get('type');
  }
  ionViewDidEnter(){
    console.log("this.info is ",this.info);
    this.backup = JSON.parse(JSON.stringify(this.info))

  }

  save(){
    this.viewCtrl.dismiss(this.info);
  }

  dismiss(){
    this.info = JSON.parse(JSON.stringify(this.backup))
    this.viewCtrl.dismiss();
  }

}
