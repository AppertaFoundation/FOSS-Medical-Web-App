import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

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
  dataArray:Array<any>;
  type:String;
  backup:Array<string>;


  constructor(private navParams:NavParams, private viewCtrl :ViewController) {
    this.dataArray =this.navParams.get("dataArray");
    this.type =this.navParams.get("type");
    // console.log(this.dataArray);
  }

  ionViewDidEnter(){
    this.backup = Object.assign([],this.dataArray);
    // console.log(this.backup);

  }

  deleteItem(item){
    let index = this.dataArray.indexOf(item);
    this.dataArray.splice(index,1);
  }

  addNew(index){
    let newItem = [""];
    this.dataArray.splice(index+1,0,newItem);
  }
  dismiss(){
    this.viewCtrl.dismiss(this.backup);
  }

  save(){
    this.viewCtrl.dismiss(this.dataArray);
  }

  customTrackBy(index:number){
    return index;
  }

}
