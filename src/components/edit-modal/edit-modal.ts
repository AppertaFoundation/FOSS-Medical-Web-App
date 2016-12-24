import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/*
  Generated class for the EditModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'edit-modal',
  templateUrl: 'edit-modal.html'
})
export class EditModalComponent {

  data: Object;
  backUp: Object;

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.data = this.navParams.get('data');
  }

  ngOnInit(){
    this.backUp = Object.assign({},this.data);
  }

  dismiss(){
    console.log("cancelling ", this.backUp);
    this.viewCtrl.dismiss(this.backUp);
  }

  save(){
    this.viewCtrl.dismiss();
  }

}
