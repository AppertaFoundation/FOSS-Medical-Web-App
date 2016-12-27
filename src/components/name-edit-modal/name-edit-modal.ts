import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
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
  image: any;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController) {
    this.name = this.navParams.get('name');
    this.image = this.navParams.get('image');
    console.log(this.name);
  }

  ionViewDidEnter() {
    if (this.image) {
      let alert = this.alertCtrl.create({
        title: "Error",
        subTitle: "This is an image file. Changing the name will break the link. Please delete and create a new section instead.",
        buttons: ['OK']
      });
      alert.present();
      this.dismiss();
    }
  }


  save() {
    this.viewCtrl.dismiss(this.name);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
