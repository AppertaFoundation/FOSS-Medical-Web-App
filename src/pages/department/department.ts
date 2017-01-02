import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { DepartmentDetailPage } from '../department-detail/department-detail';
import { NewItemComponent } from '../../components/new-item/new-item';
import { NameEditModalComponent } from '../../components/name-edit-modal/name-edit-modal';

@Component({
  selector: 'page-department',
  templateUrl: 'department.html'
})
export class Department {

  public departmentListData;

  constructor(private navCtrl: NavController, public fbServ: FirebaseService,
    private alertCtrl: AlertController, private modalCtrl: ModalController,
    private loadingCtrl: LoadingController) {
    // this.departmentListData = fbServ.getDepartmentList();
    fbServ.getList("department")
      .then((data) => {
        this.departmentListData = data;
      });
  }

  showDetail(info) {
    // console.log('item ', info);
    let index = this.departmentListData.indexOf(info);
    // console.log("index is ", index);
    this.navCtrl.push(DepartmentDetailPage, { info: info, index: index });
  }

  moveUp(info) {
    this.fbServ.moveItem("department", -1, info);
  }

  moveDown(info) {
    this.fbServ.moveItem("department", 1, info);
  }

  publishDeptData() {
    this.fbServ.publishData("department");
  }

  localSave() {
    this.fbServ.localSave("department");
  }

  localLoad() {
    this.fbServ.getLocalFlag("department")
      .then((data) => {
        if (!data) {
          this.showAlert("Error", "No Department data saved locally");
          return
        }

        else {
          this.fbServ.localLoad("department")
            .then((data) => {
              this.departmentListData = data;
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

  createNew(info) {
    let titleList = this.departmentListData.map((item)=>item.group);
    // console.log(titleList);

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
          // let index = this.departmentListData.indexOf(info);
          let newItem = { "group": item.name, "data": [{ "type": "text", "detail": "Your data here" }] };
          this.departmentListData.splice(1, 0, newItem);
          this.showDetail(newItem);
          return;
        }
        else {
          // console.log(name.file || "No file");
          //now call fbService to upload name.file as this is the file that has been selected
          //use name.content and department as part of the reference
          //TODO will need to keep a list of the images to ensure no overlap - if checked for duplicates
          //above won't need to do this!
          let loading = this.loadingCtrl.create({
            content: 'Uploading file then saving to web database. Please wait...'
          });
          loading.present();

          this.fbServ.uploadFile(item.file, "department", item.name)
          .then((uploadItem) => {
            // console.log(uploadItem.downloadURL);
            loading.dismiss();
            // let index = this.departmentListData.indexOf(info);
            let newItem = { "group": item.name, "image": [uploadItem.downloadURL] };
            this.departmentListData.splice(1, 0, newItem);
            this.publishDeptData();
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

          ;

        }
      }

    });

    newModal.present();
  }

  edit(info) {
    //edit name
    let newModal = this.modalCtrl.create(NameEditModalComponent, { name: info.group, image: info.image });
    newModal.onDidDismiss((name) => {
      if(name){info.group = name;}
    });
    newModal.present();
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
              let loading = this.loadingCtrl.create({content:"Deleting data..."});

              // console.log('Deleting images');
              info.image.forEach((imageURL, index) => {
                loading.present();
                this.fbServ.deleteFile('department', info.group, index)
                .then(()=>{
                  loading.dismiss();
                  this.publishDeptData();
                })
                .catch(()=>{
                  loading.dismiss();
                  console.log("error")})
              });
              let index = this.departmentListData.indexOf(info);
              this.departmentListData.splice(index, 1);
              return true;
            }
            else{let index = this.departmentListData.indexOf(info);
            this.departmentListData.splice(index, 1);
            return true;}

          }
        }
      ]
    });
    confirm.present();
  }
}
