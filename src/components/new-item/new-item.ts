import { Component } from '@angular/core';
import { ViewController, LoadingController, NavParams } from 'ionic-angular';

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

  name: string;
  makeImage:Boolean = false;
  file:any;
  unique:Boolean;
  titleList:Array<string>;

  constructor(private viewCtrl:ViewController,
    private loadingCtrl: LoadingController,
    private navParams:NavParams

  ) {
    this.name = "";
  }

  ionViewDidEnter(){
    this.makeImage = false;
    this.file ="";
    this.titleList = this.navParams.get('list');
    }

  upload(){
    this.viewCtrl.dismiss({"file":this.file, "name":this.name, "image":true});

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  fileChangeEvent(event){
    //file API returns an array with element 0 is the file
    this.file = event.srcElement.files[0];
    console.log(this.file);
  }

  makeData(){
    this.viewCtrl.dismiss({"name":this.name, "image":"false"});
  }

  checkUnique(){
    this.unique = (this.titleList.indexOf(this.name)== -1);
    console.log(this.unique);
  }


}
