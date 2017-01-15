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

  fileChangeEvent(event){
    if (event.target) {
      this.file = event.target.files[0];
      if(this.file.size >500000){
        this.file =null;
        return;
      }
     }
    else {
      console.log("Error no file");
    }
      // console.log(this.file);
  }

  upload() {
    if (this.file) {
      console.log("sending file ", this.file);
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


  ionViewDidEnter(){
    this.file=null;
  }

}
