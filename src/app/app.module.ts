import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { ClinicalDetailPage } from '../pages/clinical-detail/clinical-detail';
import { DepartmentDetailPage } from '../pages/department-detail/department-detail';
import { FirebaseService } from '../providers/firebase-service';



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
