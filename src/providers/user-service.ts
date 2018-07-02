import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service';
import firebase from 'firebase';
import { AuthServ } from './auth-serv';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
interface CurrentUser{
  email:string,
  specialty:string
}

@Injectable()
export class UserService {


  userList: Array<any>;
  userListObs: any;
  details: Object;
  DB;
  currentUser:CurrentUser = {email:"", specialty:""};
  userObs;//now a firebase reference to userlist
  userObservable;

  constructor(private fbServ: FirebaseService, private authServ: AuthServ) {
    this.userList = [];//an array holding users that have been downloaded from the observable
    this.details = this.fbServ.getDBDetails();
    this.userObs = firebase.database().ref(`${this.details["hospital"]}/userList`);
    this.getUsers();
    }


  setCurrentUser(user:CurrentUser) {
    this.currentUser.email = user.email;
    
  }

  setUsername(user:string){
    this.currentUser.email = user;
  }




  getUsers() {
    if (this.userList && this.userList.length > 0) {
      console.log("Resolving with :", this.userList);
      return Promise.resolve(this.userList);
    }
    else {
      return Promise.resolve(this.userObs.once('value', snapshot => {
        this.userList = snapshot.val();
        return this.userList
      })
      );

    }
  }


  getSingleUser(userName):Promise<{email:string, specialty:string}>{
    if(!this.userList || this.userList.length == 0)
    {
      console.log("No Userlist- calling");
      this.getUsers();
      return Promise.resolve({email:"", specialty:""});
    }

    return new Promise((res, rej) => {
      console.log("Entered promise in getSingleUser with list:", this.userList);
      for (let user in this.userList) {
        let lookedAtUser = this.userList[user];
        console.log("userName",userName);
        if (lookedAtUser && lookedAtUser.email == userName) {
          console.log("lookedAtUser:",lookedAtUser);
          this.currentUser.email = lookedAtUser.email;
          this.currentUser.specialty = lookedAtUser.specialty;
          console.log("Found a user specialty: ", this.currentUser.specialty);
          this.fbServ.setNewSpecialty(this.currentUser.specialty);
          console.log("GetSingleUser:", this.currentUser);

        }

      }
      res(this.currentUser);
    })
  }

  getUserInfo() {
    return this.currentUser;
  }

  loggedOutUser() {
    this.currentUser = { "email": "" , "specialty":""}
  }

  addUser(email: string, specialty: String, admin: boolean = false, ) {

    this.userObs.push({
      email: email,
      admin: admin,
      specialty: specialty
    });
    console.log("User added to userlist");
  }


  getUserDetails(user:{email:string, specialty:string}){
    console.log("looking for:",user.email);
    let details = { email: "", admin: false, specialty: "" };
    if (!this.userList || this.userList.length == 0){
      this.getUsers();
    }
    console.log("userList:",this.userList);
    for (let item in this.userList){
      let info = this.userList[item];
      if (info.email == user.email){
        details = {
          email: info.email,
          admin: info.admin,
          specialty: info.specialty
        }
      }
    }
   return details;
  }

  getSpecialties() {
    console.log("Getting the specs",`${this.details["hospital"]}/specialties`);
    return firebase.database().ref(`${this.details["hospital"]}/specialties`).once('value');
  }
  //
  // getSpecRef() {
  //   return firebase.database().ref(`${this.details["hospital"]}/specialties`);
  // }

}
