import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the FirebaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FirebaseService {


  private specialty: string = "ENT";
  private hospital: string = "James_Cook";
  private baseUrl: string = 'https://blinding-heat-4325.firebaseio.com/';
  private departmentData: Array<Object>;
  private gotDeptData: boolean = false;
  private gotClinData: boolean = false;
  private clinicalData: Array<Object>;


  constructor(public http: Http) {
    // console.log('Hello FirebaseService Provider');

  }

  getClinicalList() {
    if (!this.gotClinData) {
      return this.http.get(`https://blinding-heat-4325.firebaseio.com/James_Cook/ENT/published/clinical.json`)
        .toPromise()
        .then(response => {
          response.json();
          this.clinicalData = response.json();
          this.gotClinData = true;
          return this.clinicalData;
        });
    }
    else {
      return Promise.resolve(this.clinicalData);
    }
  }

  getDepartmentList() {
    if (!this.gotDeptData) {
      return this.http.get(`https://blinding-heat-4325.firebaseio.com/James_Cook/ENT/published/department.json`)
        .toPromise()
        .then(response => {
          response.json();
          this.departmentData = response.json();
          this.gotDeptData = true;
          return this.departmentData;
        });
    }
    else {
      return Promise.resolve(this.departmentData);
    }

  }

  reloadDeptData() {
    this.gotDeptData = false;
    this.getDepartmentList();
  }

  reloadClinData() {
    this.gotClinData = false;
    this.getClinicalList();
  }

  moveDeptItemUp(info) {
    // console.log("MoveUp",info);
    // console.log ("index is",this.departmentListData.indexOf(info));
    let selectedIndex = this.departmentData.indexOf(info);
    if (selectedIndex == 0) { return }
    else {
      let removedItem = this.departmentData.splice(selectedIndex, 1);
      this.departmentData.splice(selectedIndex - 1, 0, removedItem[0]);
    }
  }
  moveDeptItemDown(info) {
    let selectedIndex = this.departmentData.indexOf(info);
    if (selectedIndex == this.departmentData.length) { return }
    else {
      let removedItem = this.departmentData.splice(selectedIndex, 1);
      this.departmentData.splice(selectedIndex+1  , 0, removedItem[0]);
    }

  }

  moveClinUp(info){
    let selectedIndex = this.clinicalData.indexOf(info);
    if (selectedIndex == 0) { return }
    else {
      let removedItem = this.clinicalData.splice(selectedIndex, 1);
      this.clinicalData.splice(selectedIndex - 1, 0, removedItem[0]);
    }
  };
  moveClinDown(info){
    let selectedIndex = this.clinicalData.indexOf(info);
    if (selectedIndex == this.clinicalData.length) { return }
    else {
      let removedItem = this.clinicalData.splice(selectedIndex, 1);
      this.clinicalData.splice(selectedIndex+1  , 0, removedItem[0]);
    }
  };

}
