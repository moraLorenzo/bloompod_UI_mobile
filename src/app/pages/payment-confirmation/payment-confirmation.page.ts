import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { FlowersService } from 'src/app/services/flower.service';
import { Order } from '../../models/order';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.page.html',
  styleUrls: ['./payment-confirmation.page.scss'],
})
export class PaymentConfirmationPage implements OnInit {
  flowername: any;
  primary: any;
  secondary: any;
  tertiary: any;
  total: any;
  quantity: any;
  order_id: any;
  orders: any;
  index: any;

  content: any;

  link: any;
  order_flower: any;
  res: any;

  orderPayload: Order;
  imgURL = '../../../assets/icon/addImage.png';

  show = false;
  constructor(
    private fs: FlowersService,
    public router: Router,
    public dataService: DataService,
    public toastController: ToastController,
    private camera: Camera,
    private alertController: AlertController
  ) {
    this.orderPayload = new Order();
  }

  ngOnInit() {
    // this.order = history.state.data;
    console.log(history.state.data);
  }
  ionViewWillEnter() {
    this.show = false;
    this.orders = history.state.data.order;
    this.order_flower = history.state.data.order.order_flower;
    if (
      this.orders.order_flower == 'Generated Flower Bouquet' ||
      this.orders.order_flower == 'Generated Bouquet'
    ) {
      this.show = false;
    } else {
      this.show = true;
      this.link =
        'http://bloompod.api.gc-ecommerceapp.com/bloompod_api/quick/' +
        this.orders.order_flower +
        '.jpg';
    }
    this.flowername = this.orders.order_flower;
    this.primary = this.orders.main_flower;
    this.secondary = this.orders.secondary_flower;
    this.tertiary = this.orders.tertiary_flower;
    this.total = this.orders.order_totalprice;
    this.quantity = this.orders.quantity;
    this.order_id = this.orders.order_id;

    if (this.quantity == 6) {
      this.content = this.fs.six(this.primary, this.secondary);
    } else if (this.quantity == 9) {
      this.content = this.fs.nine(this.primary, this.secondary);
    } else if (this.quantity == 12) {
      this.content = this.fs.twelve(this.primary, [
        this.secondary,
        this.tertiary,
      ]);
      console.log(this.total);
    }
  }

  back() {
    this.router.navigate(['toPay']);
  }

  async pay() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention!',
      message:
        'Do you confirm that before proceeding, you have checked the fields required without any issues?',
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
            if (this.imgURL == '../../../assets/icon/addImage.png') {
              this.presentToast('Please Upload an Image First');
            } else {
              this.orderPayload.order_id = this.orders.order_id;
              this.update();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  getGallery() {
    // this.orderPayload.order_id = id;
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
      })
      .catch((e) => {
        console.log();
      });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  async update() {
    console.log(this.orderPayload);
    this.orderPayload.payment = this.imgURL;

    this.res = await this.dataService.updateImage(this.orderPayload);
    if (this.res.message == 'UPLOAD SUCCEED') {
      console.log(this.res.message);
      this.router.navigate(['tabs/tab4']);
    } else {
      console.log(this.res.message);
    }
  }
}
