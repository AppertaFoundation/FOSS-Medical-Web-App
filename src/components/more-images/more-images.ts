import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


/*
  Generated class for the MoreImages component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'more-images',
  templateUrl: 'more-images.html'
})
export class MoreImagesComponent {

  file: any;
  hasFile: Boolean;

  constructor( private viewCtrl:ViewController) {
  }
  onDidEnter() {
    this.hasFile = false;
  }

  fileChangeEvent(event) {
    this.file = event.srcElement.files;
    this.hasFile = true;
  }

  submitNameImage() {
    this.viewCtrl.dismiss({"file":this.file[0]});
  }

}
