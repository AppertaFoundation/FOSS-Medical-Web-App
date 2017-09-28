import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';



import { MyApp } from './app.component';
import { Clinical } from '../pages/clinical/clinical';
import { Department } from '../pages/department/department';
import { ClinicalDetailPage } from '../pages/clinical-detail/clinical-detail';
import { DepartmentDetailPage } from '../pages/department-detail/department-detail';
import { LoginPage } from '../pages/login/login';
import { AccountPage} from '../pages/account/account';

import { AppProviders } from './app.providers';



import { EditModalComponent } from '../components/edit-modal/edit-modal';
import { NewItemComponent } from '../components/new-item/new-item';
import { MoreImagesComponent } from '../components/more-images/more-images';
import { NameEditModalComponent } from '../components/name-edit-modal/name-edit-modal';
import { ClinicalEditModalComponent } from '../components/clinical-edit-modal/clinical-edit-modal';
import { GetImageComponent } from '../components/get-image/get-image';
import { ResetModalComponent } from '../components/reset-modal/reset-modal';



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
    GetImageComponent,
    AccountPage,
    LoginPage,
    ResetModalComponent

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()

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
  GetImageComponent,
  AccountPage,
  LoginPage,
  ResetModalComponent

  ],
  providers: AppProviders()
  
})
export class AppModule {}
