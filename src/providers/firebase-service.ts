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
  private hospital:string = "James_Cook";
  private baseUrl: string = 'https://blinding-heat-4325.firebaseio.com/';


  constructor(public http: Http) {
    // console.log('Hello FirebaseService Provider');

  }

  getClinicalList(){
    return this.http.get(`https://blinding-heat-4325.firebaseio.com/James_Cook/ENT/published/clinical.json`)
  .toPromise()
  .then(res => res.json());

  }

  getDepartmentList(){
    return this.http.get(`https://blinding-heat-4325.firebaseio.com/James_Cook/ENT/published/department.json`)
    .toPromise()
    .then(res => res.json());
;
  }

}
