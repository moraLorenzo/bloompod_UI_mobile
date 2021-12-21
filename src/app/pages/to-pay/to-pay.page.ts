import { splitClasses } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { UserService } from 'src/app/services/user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Order } from '../../models/order';

@Component({
  selector: 'app-to-pay',
  templateUrl: './to-pay.page.html',
  styleUrls: ['./to-pay.page.scss'],
})
export class ToPayPage implements OnInit {
  orders: any;
  imgURL = '../../assets/icon/addImage.png';

  orderPayload: Order;
  user_obj: any;
  userId: any;
  res: any;
  show = false;
  constructor(
    private userService: UserService,
    public router: Router,
    public dataService: DataService,
    public toastController: ToastController,
    private camera: Camera,
    private alertController: AlertController
  ) {
    this.orderPayload = new Order();
  }

  ngOnInit() {
    this.user_obj = this.userService.getUser();
    this.userId = this.user_obj.user_id;
  }

  ionViewWillEnter() {
    this.show = false;
    // this.orders = history.state.data.order;
    // console.log(this.orders);
    this.gettoPay(this.userId);
  }

  back() {
    this.router.navigate(['tabs/tab4']);
  }

  async cancel(i, order) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention!',
      message: 'Do you wish to Cancel and remove this Order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Yes',
          handler: () => {
            let order_id = order.order_id;
            // console.log(order_id);

            this.dataService
              .processData(btoa('cancel').replace('=', ''), { order_id }, 2)
              .subscribe((dt: any) => {
                let load = this.dataService.decrypt(dt.a);
                // console.log(load.msg);
                this.orders.splice(i, 1);
                this.presentToast('Order Cancelled');
              });
          },
        },
      ],
    });

    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  getGallery(id: any) {
    this.orderPayload.order_id = id;
    this.camera
      .getPicture({
        quality: 100,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
      })
      .then(async (res) => {
        let result = 'data:image/jpeg;base64,' + res;
        this.imgURL = result;
        console.log(result);

        this.update();
      })
      .catch((e) => {
        console.log();
      });
  }

  async update() {
    console.log(this.orderPayload);
    this.orderPayload.payment = this.imgURL;

    this.res = await this.dataService.updateImage(this.orderPayload);
    if (this.res.message == 'UPLOAD SUCCEED') {
      // console.log(this.res.message);
      this.router.navigate(['tabs/tab4']);
    } else {
      // console.log(this.res.message);
    }
  }

  encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      // console.log('RESULT', reader.result);
    };
    reader.readAsDataURL(file);
  }

  open_confirmation(order: any) {
    this.router.navigate(['payment-confirmation'], {
      state: {
        data: {
          order,
        },
      },
    });
  }

  gettoPay(id) {
    this.orders = [];
    let user_id = id;
    // console.log(user_id);
    this.dataService
      .processData(btoa('gettoPay').replace('=', ''), { user_id }, 2)
      .subscribe((dt: any) => {
        let load = this.dataService.decrypt(dt.a);
        // console.log(load);

        try {
          this.orders = load.payload.orders.reverse();
          this.show = false;
        } catch (err) {
          // console.log(err);
          this.show = true;
        }
        // console.log(load);
        // this.status = this.orders[0].order_status;
      });
  }
}
