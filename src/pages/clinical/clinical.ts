import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { ClinicalDetailPage } from '../clinical-detail/clinical-detail';
import { NewItemComponent } from '../../components/new-item/new-item';
import { NameEditModalComponent } from '../../components/name-edit-modal/name-edit-modal';
import { AuthServ } from '../../providers/auth-serv';
import { UserService } from '../../providers/user-service';


@Component({
  selector: 'page-clinical',
  templateUrl: 'clinical.html'
})
export class Clinical {

  public clinicalListData;
  private auth:any;

  constructor(public navCtrl: NavController,
    public fbServ: FirebaseService, private alertCtrl: AlertController,
    private modalCtrl: ModalController, private authServ: AuthServ,
    private loadingCtrl: LoadingController, private userServ: UserService
  ) {
    fbServ.getList("clinical")
      .then((data) => {
        this.clinicalListData = data;
      });
    this.auth = authServ.getAuth();
    // console.log("getAuth:",getAuth);
}

  ionViewDidEnter(){
    this.auth = this.authServ.getAuth();
    // console.log("Entered Clinical");
  }

  showDetail(info) {
    // console.log('item ', info);
    this.navCtrl.push(ClinicalDetailPage, { info: info, auth:this.auth  });
  }

  edit(info) {
    let newModal = this.modalCtrl.create(NameEditModalComponent, { name: info.title });
    newModal.onDidDismiss((name) => {
      if (name) { info.title = name };
    });
    newModal.present();
  }

  createNew(info) {
    let titleList = this.clinicalListData.map((item)=>item.title);

    let newModal = this.modalCtrl.create(NewItemComponent,{"list":titleList});
    newModal.onDidDismiss((item) => {
      // console.log('Dismissed');
      //if returns data from Modal
      if (!item || item.length == 0) {
        this.showAlert("Error", "No name provided");
      }//

      //returns an item with a property image if an image file and without one if not
      else {
        //not an image file so set up a blank set of data
        if (item.image && item.image == "false") {
          let index = this.clinicalListData.indexOf(info);
          let newItem = {
            "picture": [],
            "title": item.name,
            "summary": [],
            "shortname": [],
            "symptoms": [],
            "signs": [],
            "required": [],
            "admit": [],
            "flags": []
          };
          this.clinicalListData.splice(index+1, 0, newItem);
          // this.edit(this.clinicalListData[index+1]);
          this.showDetail(this.clinicalListData[index+1]);
          return;
        }
        else {

          let loading = this.loadingCtrl.create({
            content: 'Uploading file then saving to web database. Please wait...'
          });
          loading.present();

          this.fbServ.uploadFile(item.file, "clinical", item.name)
          .then((uploadItem) => {
            console.log(uploadItem.downloadURL);
            loading.dismiss();
            let index = this.clinicalListData.indexOf(info);
            let newItem = { "title": item.name, "image": [uploadItem.downloadURL] };
            this.clinicalListData.splice(index+1, 0, newItem);
            this.publishData();
            this.showDetail(newItem);
          },
          ((error) => {
            loading.dismiss();
              this.showAlert("Error", `File upload error,${error}`);
            })
          )
          .catch((error)=>{
            loading.dismiss();
              this.showAlert("Error", `File upload error,${error}`);
          });

        }
      }

    });

    newModal.present();
    }

  // showDetailImage(newItem){
  //     //TODO
  //   }

  delete(info) {
    if(this.clinicalListData.length == 1){
      this.showAlert("Warning","Deleting last item will erase database. Please create a new item first");
      return
        }
    let confirm = this.alertCtrl.create({
      title: 'Delete this item?',
      message: 'This will permanently remove data and images. Carry on ?',
      buttons: [
        {
          text: 'No-Cancel',
          handler: () => {
            // console.log('Disagree clicked');
            return true;
          }

        },
        {
          text: 'Yes-Delete',
          handler: () => {
            // console.log('Agree clicked');
            //TODO need to delete any firebase storage images
            if (info.image) {
              console.log('Deleting images');
              info.image.forEach((imageURL, index) => {
                let loading = this.loadingCtrl.create({
                  content: 'Deleting files...'
                });
                loading.present();
                this.fbServ.deleteFile('clinical', info.title, index)
                .then(()=>{
                  loading.dismiss()
                  this.publishData();
                  }
                )
                  .catch(()=>{
                    loading.dismiss();
                     console.log("error")
                   })
              });
              let index = this.clinicalListData.indexOf(info);
              this.clinicalListData.splice(index, 1);
              return true;
            }
            else {
              let index = this.clinicalListData.indexOf(info);
              this.clinicalListData.splice(index, 1);
              return true;
            }
          }
        }
      ]
    });
    confirm.present();
  }

  moveClinUp(info) {
    this.fbServ.moveItem("clinical", -1, info);
  }
  moveClinDown(info) {
    this.fbServ.moveItem("clinical", 1, info);
  }

  publishData() {
    let loading = this.loadingCtrl.create({
      content: 'Uploading file to web database. Please wait...'
    });
    loading.present();
    this.fbServ.publishData("clinical")
    .then(()=>loading.dismiss());
  }

  localSave() {
    this.fbServ.localSave("clinical");
  }

  localLoad() {
    this.fbServ.getLocalFlag("clinical")
      .then((data) => {
        if (!data) {
          this.showAlert("Error", "No Clincal data saved on this computer");
          return
        }

        else {
          this.fbServ.localLoad("clinical")
            .then((data) => {
              this.clinicalListData = data;
            })
            .catch((err) => {
              console.warn(err);
            })
        }
      })
  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
