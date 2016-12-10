import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { DepartmentDetailPage } from '../department-detail/department-detail';

@Component({
  selector: 'page-department',
  templateUrl: 'department.html'
})
export class Department {

  public departmentListData;

  constructor(public navCtrl: NavController, public fbServ: FirebaseService, public alertCtrl:AlertController) {
    // this.departmentListData = fbServ.getDepartmentList();
    fbServ.getDepartmentList()
    .then((data)=>{this.departmentListData = data;
    });
  }

  showDetail(info){
    // console.log('item ', info);
    this.navCtrl.push(DepartmentDetailPage,{info:info});
  }

  moveUp(info){
    this.fbServ.moveDeptItemUp(info);

  }

  moveDown(info){
    this.fbServ.moveDeptItemDown(info);
  }

  saveDeptData(){
    this.fbServ.saveDepartmentData();
  }

  localSave(){
    this.fbServ.localSave("department");
  }

  localLoad(){
    if(!this.fbServ.departmentDataLocal){
      this.showAlert("Error", "No Department data saved locally");
      return
    }
     this.fbServ.localLoad("department")
    .then((data)=>{
      this.departmentListData = data;
    })
    .catch((err)=>{
      console.warn(err);
    })
  }

  showAlert(title:string, message:string) {
   let alert = this.alertCtrl.create({
     title: title,
     subTitle: message,
     buttons: ['OK']
   });
   alert.present();
 }

}
