import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { Clinical } from '../pages/clinical/clinical';
import { Department } from '../pages/department/department';
import { ClinicalDetailPage } from '../pages/clinical-detail/clinical-detail';
import { DepartmentDetailPage } from '../pages/department-detail/department-detail';
import { FirebaseService } from '../providers/firebase-service';
import { EditModalComponent } from '../components/edit-modal/edit-modal';
import { NewItemComponent } from '../components/new-item/new-item';
import { MoreImagesComponent } from '../components/more-images/more-images';
import { NameEditModalComponent } from '../components/name-edit-modal/name-edit-modal';
import { ClinicalEditModalComponent } from '../components/clinical-edit-modal/clinical-edit-modal';
import { GetImageComponent } from '../components/get-image/get-image';




@NgModule({
  declarations: [
    MyApp,
    Clinical,
    Department,
    ClinicalDetailPage,
    DepartmentDetailPage,
    EditModalComponent,
    NewItemComponent,
    MoreImagesComponent,
    NameEditModalComponent,
    ClinicalEditModalComponent,
    GetImageComponent
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
    DepartmentDetailPage,
    EditModalComponent,
    NewItemComponent,
    MoreImagesComponent,
    NameEditModalComponent,
    ClinicalEditModalComponent,
    GetImageComponent
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseService,
    Storage

  ]
})
export class AppModule {}
