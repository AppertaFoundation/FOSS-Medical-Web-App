import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { ClinicalDetailPage } from '../clinical-detail/clinical-detail';
import { NewItemComponent } from '../../components/new-item/new-item';
import { NameEditModalComponent } from '../../components/name-edit-modal/name-edit-modal';


@Component({
  selector: 'page-clinical',
  templateUrl: 'clinical.html'
})
export class Clinical {

  public clinicalListData;

  constructor(public navCtrl: NavController,
    public fbServ: FirebaseService, private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
    fbServ.getList("clinical")
      .then(data => {
        this.clinicalListData = data;
      });
    // fbServ.getClinicalList()
    // .then((data)=>console.log(data));
  }

  showDetail(info) {
    // console.log('item ', info);
    this.navCtrl.push(ClinicalDetailPage, { info: info });
  }

  edit(info) {
    let newModal = this.modalCtrl.create(NameEditModalComponent, { name: info.title });
    newModal.onDidDismiss((name) => {
      if (name) { info.title = name };
    });
    newModal.present();
  }

  createNew(info) {
    let index = this.clinicalListData.indexOf(info);
    console.log("index ",index);
    let newItem = {
      "picture": [],
      "title": [],
      "summary": [],
      "shortname": [],
      "symptoms": [],
      "signs": [],
      "required": [],
      "admit": [],
      "flags": []
    };
    this.clinicalListData.splice(index, 0, newItem);
    // console.log(this.clinicalListData[index]);
    this.edit(this.clinicalListData[index]);
    this.showDetail(this.clinicalListData[index]);
    }

  delete(info) {
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
                this.fbServ.deleteFile('department', info.group, index)
                  .catch(() => console.log("error"))
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
    this.fbServ.publishData("clinical");
  }

  localSave() {
    this.fbServ.localSave("clinical");
  }

  localLoad() {
    this.fbServ.getLocalFlag("clinical")
      .then((data) => {
        if (!data) {
          this.showAlert("Error", "No Clincal data saved locally");
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
