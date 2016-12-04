import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { ClinicalDetailPage } from '../pages/clinical-detail/clinical-detail';
import { DepartmentDetailPage } from '../pages/department-detail/department-detail';

//import providers
import { FirebaseService } from '../providers/firebase-service';


// Import the AF2
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

//AF2 settings
export const firebaseConfig = {
  apiKey: "AIzaSyB8Tw10IW7kRd-icjiOCDnt7IorF0XWKr8",
   authDomain: "blinding-heat-4325.firebaseapp.com",
   databaseURL: "https://blinding-heat-4325.firebaseio.com",
   storageBucket: "blinding-heat-4325.appspot.com",
   messagingSenderId: "875113725983"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}


@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    ClinicalDetailPage,
    DepartmentDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    ClinicalDetailPage,
    DepartmentDetailPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseService
  ]
})
export class AppModule {}
