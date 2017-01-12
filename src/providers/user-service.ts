import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase-service';
import { AuthServ } from './auth-serv';
import { AngularFire } from 'angularfire2';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {


  userList: Array<any>;
  userListObs: any;
  details: Object;
  DB;
  currentUser;
  userObs;
  userObservable;

  constructor(private fbServ: FirebaseService, private authServ: AuthServ, private af: AngularFire) {
    this.userList = [];
    this.details = this.fbServ.getDBDetails();
    this.userObs = this.af.database.list(`${this.details["baseUrl"]}/${this.details["hospital"]}/userList`);
    this.getUsers();
  }
  //
  // getUserList() {
  // }

  setCurrentUser(user) {
    this.currentUser = user;
  }


  getUsers() {
    if (this.userList && this.userList.length > 0) {
      // console.log("Resolving with :", this.userList);
      return Promise.resolve(this.userList);
    }
    else {
      // console.log("returning the Promise");
      return new Promise((res, rej) => {
        this.userObs.subscribe(list => {
          // console.log("promise list", list)
          this.userList = list;
          res(list);
        },
          err => { rej(err); }
        )
      })
    }
  }


  getSingleUser(userName) {
    if (this.userList && this.userList.length > 0) {
      // console.log("Already have userlist");
      // console.log("Looking for userName:", userName);
      this.userList.forEach(user => {
        // console.log("Checking forEach");
        if (user && user.email) {
          // console.log("User is:", user)
          if (user.email == userName) {
            this.currentUser = user;
            // console.log("Found a user match:",this.currentUser);
            // console.log("Found a user specialty:", this.currentUser.specialty);
            this.fbServ.setNewSpecialty(this.currentUser.specialty);
            // console.log("GetSingleUser:", this.currentUser);
          }
        }
      })
    }
    else {
      // this.getUserList();
      // console.log("No user list at present");
      return "";
    }
    if (this.currentUser) {
      // console.log("returning this.currentUser:", this.currentUser);
      return this.currentUser;
    }
  }

  getUserInfo() {
    return this.currentUser;
  }

  loggedOutUser() {
    this.currentUser = { "email": "" }
  }

  addUser(email: string, specialty: String, admin: boolean = false, ) {
    this.userList.push({
      email: email,
      admin: admin,
      specialty: specialty
    })
  }


  getUserDetails(email: string): Object {
    let details = { email: null, admin: null, specialty: null };
    this.userList.forEach(user => {
      if (user.email == email) {
        details = {
          email: user.email,
          admin: user.admin,
          specialty: user.specialty
        }
      }
    })
    return details;
  }

  getSpecialties() {
    return firebase.database().ref(`${this.details["hospital"]}/specialties`).once('value');
  }

  //
  // getSpecRef() {
  //   return firebase.database().ref(`${this.details["hospital"]}/specialties`);
  // }

}
