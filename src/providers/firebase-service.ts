import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AngularFire } from 'angularfire2';
import { AuthServ } from './auth-serv';



/*
  Generated class for the FirebaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FirebaseService {


  private specialty: string = "ENT";
  private hospital: string = "James_Cook";
  private baseUrl: string = 'https://blinding-heat-4325.firebaseio.com';
  private fbStorage: any;
  private fbStorageRef: any;

  constructor(public http: Http, public storage: Storage, public af:AngularFire, private authServ: AuthServ) {

    this.fbStorage = firebase.storage();
    this.fbStorageRef = this.fbStorage.ref();
    // console.log('Hello FirebaseService Provider');
  }

  getList(type: string) {
    let dataType = type + "Data";
    if (!this[dataType + "Fetched"]) {
      return this.http.get(`${this.baseUrl}/${this.hospital}/${this.specialty}/published/${type}.json`)
        .toPromise()
        .then(response => {
          response.json();
          this[dataType] = response.json();
          this[dataType + "Fetched"] = true;
          return this[dataType];
        });
    }
    else {
      return Promise.resolve(this[dataType]);
    }
  }

  getDBDetails(){
    let details:Object =  { specialty:this.specialty,
      hospital: this.hospital,
      baseUrl: this.baseUrl
      }
    return details;
  }



  manageDetail(type: string, detailObject: Object) {
    this[type + "DetailData"] = detailObject;
  }


  publishData(type: string) {

    return this.http.put(`${this.baseUrl}/${this.hospital}/${this.specialty}/published/${type}.json`, this[type + "Data"])
      .toPromise();
  }
  publishDetail(type: string, index: Number, data: Object) {
    //type can include index and 'data' to publish department data
    return this.http.put(`${this.baseUrl}/${this.hospital}/${this.specialty}/published/${type}/${index}/data.json`, data)
      .toPromise();
  }


  reloadData(type: string) {
    this[type + "DataFetched"] = false;
    this.getList(type);
  }


  moveItem(type: string, direction: number, info: any) {
    //number -1 = Up, +1 = Down
    // console.log("MoveUp",info);
    // console.log ("index is",this.departmentListData.indexOf(info));
    let dataType = type + "Data";
    let selectedIndex = this[dataType].indexOf(info);
    if (direction == -1 && selectedIndex == 0) { return }
    if (direction == 1 && selectedIndex == this[dataType].length) { return }
    else {
      let removedItem = this[dataType].splice(selectedIndex, 1);
      this[dataType].splice(selectedIndex + direction, 0, removedItem[0]);
    }
  }

  localSave(type: string) {//eg clinical or department
    let savingType = type + "Data";
    this[savingType + "Local"] = true;
    this.storage.set(savingType + "Local", "true");
    let toSaveData = JSON.stringify(this[savingType]);
    this.storage.set(savingType, toSaveData);
  }

  localLoad(type: string) {
    let savingType = type + "Data";
    return this.storage.get(savingType)
      .then((response) => {
        let convertedData = JSON.parse(response);
        this[savingType] = convertedData;
        return convertedData
      });
  }

  getLocalFlag(type: string) {
    let savingType = type + "Data";
    return this.storage.get(savingType + "Local");
  }

  uploadFile(file: any, type: string, name: string, fileNumber: number = 0) {
    // let ref = firebase.storage().ref();
    // return  ref.child(`/${this.hospital}/${this.specialty}/${type}/${name}/${fileNumber}`).put(file);
    return firebase.storage().ref().child(`/${this.hospital}/${this.specialty}/${type}/${name}/${fileNumber}`).put(file);

}


  deleteFile(type: string, name: string, fileNumber: number = 0) {
    let ref = firebase.storage().ref().child(`/${this.hospital}/${this.specialty}/${type}/${name}/${fileNumber}`);
    return ref.delete();
  }
}
