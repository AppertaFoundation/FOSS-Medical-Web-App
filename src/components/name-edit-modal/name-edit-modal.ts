import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
/*
  Generated class for the NameEditModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'name-edit-modal',
  templateUrl: 'name-edit-modal.html'
})
export class NameEditModalComponent {

  name: string;

  constructor(private navParams:NavParams, private viewCtrl:ViewController) {
   this.name = this.navParams.get('name');
   console.log(this.name);
  }

  save(){
    this.viewCtrl.dismiss(this.name);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }


}
