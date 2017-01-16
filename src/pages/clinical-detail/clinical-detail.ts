import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { ClinicalEditModalComponent } from '../../components/clinical-edit-modal/clinical-edit-modal';
import { GetImageComponent } from '../../components/get-image/get-image';
import { MoreImagesComponent } from '../../components/more-images/more-images';

/*
  Generated class for the ClinicalDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-clinical-detail',
  templateUrl: 'clinical-detail.html'
})
export class ClinicalDetailPage {
  detailObject: Object;
  auth:Boolean

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fbServ: FirebaseService, private modalCtrl: ModalController,
    private loadingCtrl: LoadingController

  ) {

    this.detailObject = this.navParams.get('info');
    // console.log(this.detailObject);
    this.auth = this.navParams.get('auth');

    this.fbServ.manageDetail("clinical", this.detailObject);
    // console.log(this.detailObject);
  }

  ionViewDidLoad() {
    // console.log('Hello ClinicalDetailPage Page');
  }

  editPicture() {
    // console.log("detailObject: ",this.detailObject);
    // console.log(this.detailObject["title"]);
    if (typeof this.detailObject["picture"] == "undefined") {
      this.detailObject["picture"] = "";
    }
    // console.log(this.detailObject["picture"]);
    let pictureModal = this.modalCtrl.create(GetImageComponent, { "detailObject": this.detailObject });
    pictureModal.onDidDismiss((item) => {
      if (item) {
        //returned an image so upload it
        let loading = this.loadingCtrl.create({
          content: 'Uploading image and saving to web database. Please wait...'
        });
        loading.present();
        // this.detailObject.picture
        console.log(item);

        this.fbServ.uploadFile(item.file, 'clinical', this.detailObject["title"], 0)
          .then((uploadItem) => {
            loading.dismiss();
            this.detailObject["picture"] = uploadItem.downloadURL;
            this.fbServ.publishData("clinical");
            // this.navCtrl.pop();
          })
          .catch((error) => {
            console.log('file error');
            loading.dismiss();
          })

      }
    });
    pictureModal.present();

  }

  deletePicture() {
    let loading = this.loadingCtrl.create({ content: "Deleting data..." });

    console.log('Deleting images');
    loading.present();
    this.fbServ.deleteFile('clinical', this.detailObject["title"], 0)
      .then(() => {
        loading.dismiss();
        this.detailObject["picture"]= "";
        this.fbServ.publishData("clinical");
      })
      .catch(() => {
        loading.dismiss();
        console.log("error")
      });
  }


  editItem(type: string) {
    // console.log("detail array is: ", this.detailObject[type]);
    let newModal = this.modalCtrl.create(ClinicalEditModalComponent, { "dataArray": this.detailObject[type], "type": type });
    newModal.onDidDismiss((item) => {
      if (item) {
        this.detailObject[type] = item;
      }
    })
    newModal.present();

  }

  upLoadMoreImages() {
    let imagesModal = this.modalCtrl.create(MoreImagesComponent);
    // console.log(imagesObject);
    let imageNumber = this.detailObject["image"].length;

    imagesModal.onDidDismiss((item) => {
      if (item) {//will be a file
        // console.log(item);

        let loading = this.loadingCtrl.create({
          content: 'Uploading image and saving to web database. Please wait...'
        });
        loading.present();
        //item needs uploading to firebase then we need the upload URL
        this.fbServ.uploadFile(item, 'clinical', this.detailObject["title"], imageNumber)
          .then((uploadItem) => {
            loading.dismiss();
            this.detailObject["image"].push(uploadItem.downloadURL);
            this.fbServ.publishData("clinical");
          })
          .catch((error) => { console.log('file error') ;
          loading.dismiss();
        })

      }
    });
    imagesModal.present();
  }

  localSave(){
    this.fbServ.localSave("clinical");
  }


}
