import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Clinical } from '../pages/clinical/clinical';
import { Department } from '../pages/department/department';
import { LoginPage } from '../pages/login/login';
import { AccountPage } from '../pages/account/account';

import firebase from 'firebase';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor( platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    firebase.initializeApp({
      apiKey: "ADD YOUR OWN FIREBASE KEYS HERE",
      authDomain: "ADD YOUR OWN FIREBASE KEYS HERE",
      databaseURL: "ADD YOUR OWN FIREBASE KEYS HERE",
      storageBucket: "ADD YOUR OWN FIREBASE KEYS HERE",
      messagingSenderId: "ADD YOUR OWN FIREBASE KEYS HERE" });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Clinical', component: Clinical },
      { title: 'Department', component: Department},
      { title: 'Login', component: LoginPage },
      { title : 'Accounts', component: AccountPage }
    ];

  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
