import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { EditModalComponent } from '../../components/edit-modal/edit-modal';
import { MoreImagesComponent } from '../../components/more-images/more-images';

/*
  Generated class for the ClinicalDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-department-detail',
  templateUrl: 'department-detail.html'
})
export class DepartmentDetailPage {
  detailObject: Array<any>;
  pageTitle: String;
  index: Number;
  confirm: Boolean;
  isImage: Boolean;
  auth: Boolean;


  constructor(public navCtrl: NavController,
    public navParams: NavParams, public fbServ: FirebaseService,
    private modalCtrl: ModalController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

    let allDetails = this.navParams.get('info');
    this.auth = this.navParams.get('auth');
    if (allDetails.data) {
      this.detailObject = allDetails.data;
    }
    else {
      this.detailObject = allDetails;
    }
    this.pageTitle = this.navParams.get('info');
    this.index = this.navParams.get('index');
    // console.log("PageTitle:", this.pageTitle);
    // console.log("detailObject:", this.detailObject);
    this.fbServ.manageDetail("department", this.detailObject);
    // console.log("object is ",this.detailObject);


  }

  ionViewDidEnter() {
    this.isImage = false;
  }

  moveUp(data) {
    this.fbServ.moveItem("departmentDetail", -1, data);
  }
  moveDown(data) {
    this.fbServ.moveItem("departmentDetail", 1, data);
  }

  publishDetails(detailObject) {
    // TODO need to know item index and the group name
    this.fbServ.publishData("department");
  }

  ionViewDidLoad() {
    // console.log('Hello DepartmentDetailPage Page');
  }

  edit(data) {
    let editModal = this.modalCtrl.create(EditModalComponent, { data: data });

    editModal.onDidDismiss((item) => {

      if (item) {
        data.detail = item.detail;
        data.type = item.type;
        // console.log(item);
      }

    });
    editModal.present();
  }

  newItem(data?) {
    let newItem = {
      "type": "text",
      "detail": ""
    };

    let tempIndex = this.detailObject.indexOf(data);
    this.detailObject.splice(tempIndex+1, 0, newItem);
    let newItemRef = this.detailObject[tempIndex+1];
    this.edit(newItemRef);

  }

  delete(data) {
    let tempIndex = this.detailObject.indexOf(data);
    this.showConfirm(this.detailObject, tempIndex);
    // console.log('Confirming:',this.confirm);
    // this.detailObject.splice(tempIndex,1);

  }

  upLoadMoreImages(imagesObject) {
    let imagesModal = this.modalCtrl.create(MoreImagesComponent);
    // console.log(imagesObject);
    let imageNumber = imagesObject.image.length;

    imagesModal.onDidDismiss((item) => {
      if (item) {//will be a file
        // console.log(item);
        this.isImage = true;
        let loading = this.loadingCtrl.create({
          content: 'Uploading image and saving to web database. Please wait...'
        });
        loading.present();
        //item needs uploading to firebase then we need the upload URL
        this.fbServ.uploadFile(item, 'department', imagesObject.group, imageNumber)
          .then((uploadItem) => {
            console.log("Uploaded file now have upload")
            loading.dismiss();
            imagesObject.image.push(uploadItem.downloadURL);
            this.fbServ.publishData("department");
          })
          .catch((error) => { console.log('file error') ;
          loading.dismiss();
        })

      }
    });
    imagesModal.present();
  }

  localSave() {
    this.fbServ.localSave("department");
  }

  showConfirm(DeleteObj, DeleteIndex) {
    let confirm = this.alertCtrl.create({
      title: 'Delete this item?',
      message: 'Do you want to permanently delete this?',
      buttons: [
        {
          text: 'No-Cancel',
          handler: () => {
            //  console.log('Disagree clicked');
            return true;
          }

        },
        {
          text: 'Yes-Delete',
          handler: () => {
            //  console.log('Agree clicked');
            DeleteObj.splice(DeleteIndex, 1);
            return true;

          }
        }
      ]
    });
    confirm.present();
  }






}
