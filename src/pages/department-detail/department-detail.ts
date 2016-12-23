import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { EditModalComponent } from '../../components/edit-modal/edit-modal';

/*
  Generated class for the ClinicalDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-department-detail',
  templateUrl: 'department-detail.html'
})
export class DepartmentDetailPage {
  detailObject: Object;
  pageTitle:String;
  index: Number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fbServ: FirebaseService, private modalCtrl: ModalController) {

    this.detailObject =this.navParams.get('info').data;
    this.pageTitle = this.navParams.get('info');
    this.index = this.navParams.get('index');
    // console.log("PageTitle:", this.pageTitle);
    // console.log("detailObject:", this.detailObject);
    this.fbServ.manageDetail("department", this.detailObject);
    // console.log("object is ",this.detailObject);
  }

  moveUp(data){
    this.fbServ.moveItem("departmentDetail", -1, data);
  }
  moveDown(data){
    this.fbServ.moveItem("departmentDetail", 1, data);
  }

  publishDetails(detailObject){
    // TODO need to know item index and the group name
    this.fbServ.publishDetail("department", this.index, detailObject);
  }

  ionViewDidLoad() {
    // console.log('Hello DepartmentDetailPage Page');
  }

  edit(data){
    let editModal = this.modalCtrl.create(EditModalComponent,{data:data});

    editModal.onDidDismiss((item) => {

      if(item){
        data.detail = item.detail;
        data.type = item.type;
        console.log(item)
      }

});
    editModal.present();
        console.log('editting ',data);

  }



}
