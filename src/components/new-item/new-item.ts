import { Component } from '@angular/core';

/*
  Generated class for the NewItem component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'new-item',
  templateUrl: 'new-item.html'
})
export class NewItemComponent {

  text: string;

  constructor() {
    console.log('Hello NewItem Component');
    this.text = 'Hello World';
  }

}
