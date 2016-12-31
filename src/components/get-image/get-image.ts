import { Component } from '@angular/core';
import { ViewController, LoadingController, NavParams } from 'ionic-angular';


/*
  Generated class for the GetImage component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'get-image',
  templateUrl: 'get-image.html'
})
export class GetImageComponent {

  file: File;
  detailObject: Object;

  constructor(private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams) {
    this.detailObject = this.navParams.get("detailObject");

  }
  upload() {
    if (this.file) {
      // console.log("sending file ", this.file);
      this.viewCtrl.dismiss({ "file": this.file, "name": this.detailObject["title"], "image": true });
    }
    else {
      console.log("no file");
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fileChangeEvent(event) {
    //file API returns an array with element 0 is the file
    // console.log(event);
    if (event.target)
    { this.file = event.target.files[0]; }
    else {
      console.log("Error no file");
    }
  }

}
