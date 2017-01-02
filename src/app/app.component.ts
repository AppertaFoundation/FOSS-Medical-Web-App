import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Clinical } from '../pages/clinical/clinical';
import { Department } from '../pages/department/department';
import { AngularFire } from 'angularfire2';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Clinical;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public af:AngularFire) {
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
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
