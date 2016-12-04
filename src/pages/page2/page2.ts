import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { DepartmentDetailPage } from '../department-detail/department-detail';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {

  public departmentListData;

  constructor(public navCtrl: NavController, public fbServ: FirebaseService) {
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

}
