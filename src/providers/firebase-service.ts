import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AuthServ } from './auth-serv';
import firebase from 'firebase';
import {config, dbDetails } from '../assets/dbdetails';


/*
  Generated class for the FirebaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
interface Details {
  hospital:string,
  baseUrl:string,
  specialty:string
}

@Injectable()
export class FirebaseService {


  private specialty: string = dbDetails.specialty;
  private hospital: string = dbDetails.hospital;
  private baseUrl: string = config.databaseURL;
  // private fbStorage: any;
  // private fbStorageRef: any;
  private details:Details;
  private date:any;


  constructor(public http: Http, public storage: Storage,  private authServ: AuthServ,
    private alertCtrl:AlertController ) {

    // this.fbStorage = firebase.storage();
    // this.fbStorageRef = this.fbStorage.ref();
    this.date = Date.now();
    
  }

  getList(type: string) {
    let dataType = this.specialty + type + "Data";//now including specialty in the dataType
    if (!this[dataType + "Fetched"]) {
      return this.http.get(`${this.baseUrl}/${this.hospital}/${this.specialty}/published/${type}.json`)
        .toPromise()
        .then(response => {
          console.log(`got data of type ${type}`,response);
          response.json();
          this[dataType] = response.json();
          this[dataType + "Fetched"] = true;
          return this[dataType];
        })
        .catch(err=>{console.log("No Clin data in FBServ")})
    }
    else {
      return Promise.resolve(this[dataType]);
    }
  }

  setupFirstDB(){

    let blank = { 
        "published":{
            "date":`${this.date}`,
            "clinical":{0:{
              "admit":{
                0:"blank"
              },
               "flags":{
                 0:" "
               },
               "picture":" ",
               "required":{
                 0:" "
               },
               "shortname":"blank",
               "signs":{
                 0:" "
               },
               "summary":{
                0:" "
              },
               "symptoms":{
                0:" "
              },
               "title":"blank"}

                },
           "department":{
             0:{"data":{
               0:{
                 "detail":"blank",
                 "type":"title"
               }
             },
             "group":"blank"}
               }
        }
  
    };
    let specialties = {
      0:`${this.specialty}`
    }
    let specString = "specialties";
    let userStr = "userList"
    let fbdb = firebase.database();
    console.log("Setting up firebase -");
    return fbdb.ref(`${this.hospital}/${this.specialty}`).set(blank)
    .then(()=>{
      console.log("Blank is set");
      fbdb.ref(`${this.hospital}/${specString}`).set(specialties)})
    .catch((err)=>console.log("Blank error ",err))

    // .then(()=>{fbdb.ref(`${this.hospital}/${userStr}`).set("")})
  
  }



  getNewSpecialty():string{
    return this.specialty;
  }

  setNewSpecialty(newSpec:string){
    this.specialty = newSpec;
    console.log("Stored specialty", this.specialty);
  }

  getDBDetails(){
    this.details =  { specialty:this.specialty,
      hospital: this.hospital,
      baseUrl: this.baseUrl
      }
    return this.details;
  }



  manageDetail(type: string, detailObject: Object) {
    this[this.specialty + type+ "DetailData"] = detailObject;
  }


  publishData(type: string) {
    return firebase.auth().currentUser.getIdToken()
    .then((token)=>{
      this.http.put(`${this.baseUrl}/${this.hospital}/${this.specialty}/published/${type}.json?auth=${token}`, this[`${this.specialty}${type}Data`])
      .toPromise();
    })

    
  }
  publishDetail(type: string, index: Number, data: Object) {
    //type can include index and 'data' to publish department data
    return this.http.put(`${this.baseUrl}/${this.hospital}/${this.specialty}/published/${type}/${index}/data.json`, data)
      .toPromise();
  }


  reloadData(type: string) {
    this[this.specialty + type + "DataFetched"] = false;
    this.getList(type);
  }


  moveItem(type: string, direction: number, info: any) {
    //number -1 = Up, +1 = Down
    // console.log("MoveUp",info);
    // console.log ("index is",this.departmentListData.indexOf(info));
    let dataType = this.specialty + type +  "Data";
    let selectedIndex = this[dataType].indexOf(info);
    if (direction == -1 && selectedIndex == 0) { return }
    if (direction == 1 && selectedIndex == this[dataType].length) { return }
    else {
      let removedItem = this[dataType].splice(selectedIndex, 1);
      this[dataType].splice(selectedIndex + direction, 0, removedItem[0]);
    }
  }

  localSave(type: string) {//eg clinical or department
    this.showAlert("Saving","A copy of this data is being saved on this PC");
    let savingType = this.specialty + type +  "Data";
    this[savingType + "Local"] = true;
    this.storage.set(savingType + "Local", "true");
    let toSaveData = JSON.stringify(this[savingType]);
    this.storage.set(savingType, toSaveData);
  }

  localLoad(type: string) {
    this.showAlert("Loading","Trying to load data, saved on this PC");
    let savingType =this.specialty + type +  "Data";
    return this.storage.get(savingType)
      .then((response) => {
        let convertedData = JSON.parse(response);
        this[savingType] = convertedData;
        return convertedData
      })
      .catch(err=>{
        this.showAlert("Error loading data!",err);
      })

      ;
  }

  getLocalFlag(type: string) {
    let savingType = this.specialty + type +  "Data";
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

  showAlert(title: string, message: any) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
