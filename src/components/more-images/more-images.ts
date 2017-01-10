import { Component } from '@angular/core';
import { ViewController, LoadingController } from 'ionic-angular';


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
  file:any;

  constructor(private viewCtrl:ViewController,   private loadingCtrl: LoadingController ){
    }

  upload(){
    this.viewCtrl.dismiss(this.file);
  }

  fileChangeEvent(event){
    if (event.target)
    { this.file = event.target.files[0]; }
    else {
      console.log("Error no file");
    }
      // console.log(this.file);
  }

  ionViewDidEnter(){
    this.file="";
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
