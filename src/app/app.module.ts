import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { Clinical } from '../pages/clinical/clinical';
import { Department } from '../pages/department/department';
import { ClinicalDetailPage } from '../pages/clinical-detail/clinical-detail';
import { DepartmentDetailPage } from '../pages/department-detail/department-detail';
import { FirebaseService } from '../providers/firebase-service';



@NgModule({
  declarations: [
    MyApp,
    Clinical,
    Department,
    ClinicalDetailPage,
    DepartmentDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Clinical,
    Department,
    ClinicalDetailPage,
    DepartmentDetailPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseService,
    Storage
  ]
})
export class AppModule {}
