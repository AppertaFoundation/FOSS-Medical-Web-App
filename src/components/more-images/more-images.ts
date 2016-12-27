import { Component } from '@angular/core';

/*
  Generated class for the MoreImages component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'more-images',
  templateUrl: 'more-images.html'
})
export class MoreImagesComponent {

  text: string;

  constructor() {
    console.log('Hello MoreImages Component');
    this.text = 'Hello World';
  }

}
