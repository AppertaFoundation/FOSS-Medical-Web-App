import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/*
  Generated class for the NewItem component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'new-item',
  templateUrl: 'new-item.html'
})
export class NewItemComponent {

  content: string;
  acceptFile: Boolean =false;
  file:any;
  hasFile:Boolean;

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {

    this.content = "";

  }

  onDidEnter(){
    this.hasFile = false;

  }

  submitName() {
    this.viewCtrl.dismiss({ "image": "false", "content": this.content });
  }

  submitNameImage() {
    this.viewCtrl.dismiss({ "image": "true", "file":this.file, "content":this.content });

  }

  dismiss() {
    console.log("cancelling ");
    this.viewCtrl.dismiss();
  }

  fileChangeEvent(event){

    this.file = event.srcElement.files;
    this.hasFile = true;
    // console.log(this.file);
  }

}
