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


  userList:any;
  userListObs:any;

  constructor( private fbServ:FirebaseService, private authServ:AuthServ, private af:AngularFire) {
    this.getUserList();
  }

  getUserList(){
    let details:Object = this.fbServ.getDBDetails();

    if (this.authServ.getUser()){
      this.userList = this.af.database.list(`${details["baseUrl"]}/${details["hospital"]}/${details["specialty"]}/userList`)
    }
  }

  getUsers(){
    return this.userList;
  }

  addUser(email:string, specialty:string, admin:boolean =false,){
      this.userList.push({
      email:email,
      admin:admin,
      specialty:specialty
    })
  }


    getUserDetails(email:string):Object{
      let details = {email:null, admin:null, specialty:null};
      this.userList.forEach(user=>{
        if (user.email == email){
          details = {
            email:user.email,
            admin: user.admin,
            specialty: user.specialty
          }
        }
      })
      return details;
      }

}
