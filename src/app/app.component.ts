import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Clinical } from '../pages/clinical/clinical';
import { Department } from '../pages/department/department';
import firebase  from 'firebase';

import ImgCache from 'imgcache.js';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Department;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform) {
    firebase.initializeApp({
      apiKey: "AIzaSyB8Tw10IW7kRd-icjiOCDnt7IorF0XWKr8",
      authDomain: "blinding-heat-4325.firebaseapp.com",
      databaseURL: "https://blinding-heat-4325.firebaseio.com",
      storageBucket: "blinding-heat-4325.appspot.com",
      messagingSenderId: "875113725983"
    });

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Clinical', component: Clinical },
      { title: 'Department', component: Department }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      //ImgCache setup- activate debug mode
      ImgCache.options.debug = true;

      //Wait fro ImgCache to startup
      ImgCache.init(()=> {return},
                    () => {console.log('ImgCache Error- check log')
                  })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
