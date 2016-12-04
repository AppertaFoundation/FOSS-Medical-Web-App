import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

/*
  Generated class for the FirebaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FirebaseService {

  clinicalList: FirebaseListObservable<any>;
  departmentList: FirebaseListObservable<any>;
  clinicalDetail: FirebaseObjectObservable<any>;
  hospital:string = "James_Cook";
  specialty: string = "ENT";

  constructor(public http: Http, public af: AngularFire) {
    // console.log('Hello FirebaseService Provider');
    this.clinicalList = this.af.database.list(`${this.hospital}/${this.specialty}/published/clinical`);
    this.departmentList = this.af.database.list(`${this.hospital}/${this.specialty}/published/department`);

  }

  getClinicalList(){
    return this.clinicalList;
  }

  getDepartmentList(){
    return this.departmentList;
  }

}
