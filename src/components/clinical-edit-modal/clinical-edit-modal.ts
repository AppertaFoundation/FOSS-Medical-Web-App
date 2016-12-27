import { Component } from '@angular/core';

/*
  Generated class for the ClinicalEditModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'clinical-edit-modal',
  templateUrl: 'clinical-edit-modal.html'
})
export class ClinicalEditModalComponent {

  text: string;

  constructor() {
    console.log('Hello ClinicalEditModal Component');
    this.text = 'Hello World';
  }

}
