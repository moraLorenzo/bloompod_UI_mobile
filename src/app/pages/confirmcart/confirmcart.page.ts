import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { FlowersService } from 'src/app/services/flower.service';

@Component({
  selector: 'app-confirmcart',
  templateUrl: './confirmcart.page.html',
  styleUrls: ['./confirmcart.page.scss'],
})
export class ConfirmcartPage implements OnInit {
  flowername: any;
  obj_flowers: any;
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

  Flowers: any;
  floral: any;
  cpt = 0;
  secondary_price: any;
  tertiary_price: any;
  primary_price: any;
  quick_price: any;

  details: any;

  show = false;
  constructor(
    private fs: FlowersService,
    public router: Router,
    public dataService: DataService,
    public toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // this.order = history.state.data;
    console.log(history.state.data);
  }
  ionViewWillEnter() {
    this.show = false;
    this.index = history.state.data.i;
    this.orders = history.state.data.order;
    this.order_flower = history.state.data.order.order_flower;
    if (
      this.orders.order_flower == 'Generated Flower Bouquet' ||
      this.orders.order_flower == 'Generated Bouquet'
    ) {
      this.show = false;
      console.log('automator');

      this.dataService
        .processData(btoa('get_flowers').replace('=', ''), null, 2)
        .subscribe(
          (dt: any) => {
            let load = this.dataService.decrypt(dt.a);
            console.log(load);

            // for (let i = 0; i < this.Flowers.length; i++) {

            //   this.floral.push(this.Flowers[i]['flower_name']);
            // }

            this.Flowers = load.payload.data;
            this.proceed();
          },
          (er) => {
            console.log('Invalid Inputs', er);
          }
        );
    } else {
      this.show = true;
      this.link =
        'http://bloompod.api.gc-ecommerceapp.com/bloompod_api/quick/' +
        this.orders.order_flower +
        '.jpg';
      console.log('not automator');

      this.dataService
        .processData(btoa('get_bouquets').replace('=', ''), null, 2)
        .subscribe(
          (dt: any) => {
            let load = this.dataService.decrypt(dt.a);
            // console.log(load);
            this.obj_flowers = load.payload.data;
            console.log(this.obj_flowers);

            this.obj_flowers.forEach((element) => {
              console.log(element);

              if (this.orders.order_flower == element.quick_name) {
                this.quick_price = element.quick_price;
                this.details = element.quick_details;
              }
            });
          },
          (er) => {
            console.log('Invalid Inputs', er);
          }
        );
    }
  }

  proceed() {
    this.flowername = this.orders.order_flower;
    this.primary = this.orders.main_flower;
    this.secondary = this.orders.secondary_flower;
    this.tertiary = this.orders.tertiary_flower;
    this.total = this.orders.order_totalprice;
    this.quantity = this.orders.quantity;
    this.order_id = this.orders.order_id;

    if (this.quantity == 6) {
      this.content = this.fs.six(this.primary, this.secondary);
      this.Flowers.forEach((element) => {
        console.log(element);

        if (this.primary == element.flower_name) {
          this.primary_price = element.flower_price;
        }

        if (this.secondary == element.flower_name) {
          this.secondary_price = element.flower_price;
        }
      });
    } else if (this.quantity == 9) {
      this.Flowers.forEach((element) => {
        console.log(element);

        if (this.primary == element.flower_name) {
          this.primary_price = element.flower_price;
        }

        if (this.secondary == element.flower_name) {
          this.secondary_price = element.flower_price;
        }
      });
      this.content = this.fs.nine(this.primary, this.secondary);
    } else if (this.quantity == 12) {
      console.log(this.Flowers);
      this.Flowers.forEach((element) => {
        console.log(element);

        if (this.primary == element.flower_name) {
          this.primary_price = element.flower_price;
        }

        if (this.secondary == element.flower_name) {
          this.secondary_price = element.flower_price;
        }

        if (this.tertiary == element.flower_name) {
          this.tertiary_price = element.flower_price;
        }
      });

      this.content = this.fs.twelve(this.primary, [
        this.secondary,
        this.tertiary,
      ]);
      console.log(this.total);
    }
  }

  mode() {
    let order = this.orders;
    // let primary = order.main_flower
    this.router.navigate(['mode'], {
      state: {
        data: {
          quantity: order.quantity,
          primary: order.main_flower,
          secondary: order.secondary_flower,
          tertiary: order.tertiary_flower,
          total: order.order_totalprice,
          order_id: order.order_id,
        },
      },
    });
  }

  async cancel() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention!',
      message: 'Do you wish to cancel and remove this Bouquet?',
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
            let order_id = this.order_id;
            let i = history.state.data.i;
            this.dataService
              .processData(btoa('cancel').replace('=', ''), { order_id }, 2)
              .subscribe((dt: any) => {
                let load = this.dataService.decrypt(dt.a);
                console.log(load);
                this.presentToast(load.msg);
                this.router.navigate(['tabs/tab1']);
              });
          },
        },
      ],
    });

    await alert.present();
  }

  back() {
    this.router.navigate(['tabs/tab4']);
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
}
