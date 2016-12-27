import { Component } from '@angular/core';

/*
  Generated class for the NameEditModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'name-edit-modal',
  templateUrl: 'name-edit-modal.html'
})
export class NameEditModalComponent {

  text: string;

  constructor() {
    console.log('Hello NameEditModal Component');
    this.text = 'Hello World';
  }

}
