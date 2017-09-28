import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
// import { Camera } from '@ionic-native/camera';

import { FirebaseService } from '../providers/firebase-service';
import { AuthServ } from '../providers/auth-serv';
import { UserService } from '../providers/user-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
 
// class CameraMock {
//   getPicture(options) {
//     return new Promise((resolve, reject) => {
//       resolve("BASE_64_ENCODED_DATA_GOES_HERE");
//     })
//   }
// }
 
export function AppProviders (){
    let providers
       if(document.URL.includes('https://') || document.URL.includes('http://')){
            console.log("using browser plugins");
          // Use browser providers
          providers= [{provide: ErrorHandler, useClass: IonicErrorHandler},
            FirebaseService,
            Storage,
            AuthServ,
            UserService,
            StatusBar,
            SplashScreen
          ]
 
 
       }
        else{
          providers= [{provide: ErrorHandler, useClass: IonicErrorHandler},
            FirebaseService,
            Storage,
            AuthServ,
            UserService,
            StatusBar,
            SplashScreen
          ]
 
        }
 
        return providers;
 
    }
 
