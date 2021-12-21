import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import {
  AlertController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { AboutPage } from '../modal/about/about.page';
import { Doctor } from '../models/doctor';
// import { PopoverComponent } from '../pages/edit/popover/popover.component';
import { DataService } from '../services/data/data.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  flowers: any;
  selectedCurrency: any = '₱';
  obj_flowers: any;
  user_obj: any;
  Userid: any;
  orders: any = [];
  order_flowers: any = [];
  user_status: string;

  greet: string = 'Good Day';

  username: string = 'Guest';
  schedules: any;

  month: string = 'Sample Month';

  months: any = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  // user_obj: any;

  constructor(
    private dataService: DataService,
    private alertController: AlertController,
    public popoverController: PopoverController,
    private userService: UserService
  ) {
    var myDate = new Date();
    var hrs = myDate.getHours();

    if (hrs < 12) this.greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17) this.greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24) this.greet = 'Good Evening';

    this.month = this.months[new Date().getMonth()];
    console.log('1');
  }

  async ngOnInit() {
    this.get_bouquet();
    this.getFlower();
    this.check_user();
  }

  ionViewWillEnter() {
    // console.log(window.sessionStorage.getItem('doctor_id'));
    this.ngOnInit();
    this.user_obj = this.userService.getUser();
    this.username =
      this.user_obj.user_firstname + ' ' + this.user_obj.user_lastname;
  }

  check_user() {
    let check_user = sessionStorage.getItem('token');
    if (check_user != 'guest') {
      this.user_obj = this.userService.getUser();
      this.Userid = this.user_obj.user_id;
    } else {
      // console.log("GUEST");
      this.user_status = check_user;
    }
  }

  bouquet_loop() {
    for (let i = 0; i < this.obj_flowers.length; i++) {
      if (this.obj_flowers[i]['quick_name'] == null) {
        console.log('none');
      } else {
        this.orders.push({
          image:
            'http://bloompod.api.gc-ecommerceapp.com/bloompod_api/quick/' +
            this.obj_flowers[i]['quick_name'] +
            '.jpg',
          thumbImage:
            'http://bloompod.api.gc-ecommerceapp.com/bloompod_api/quick/' +
            this.obj_flowers[i]['quick_name'] +
            '.jpg',
          title:
            this.obj_flowers[i]['quick_name'] +
            '- ₱' +
            this.obj_flowers[i]['quick_price'],
          quick_id: this.obj_flowers[i]['quick_id'],
          quick_name: this.obj_flowers[i]['quick_name'],
          quick_price: this.obj_flowers[i]['quick_price'],
          quick_details: this.obj_flowers[i]['quick_details'],
          is_available: this.obj_flowers[i]['is_available'],
        });
      }
    }
    // console.log(this.orders);
  }

  get_bouquet() {
    this.dataService
      .processData(btoa('get_bouquets').replace('=', ''), null, 2)
      .subscribe(
        (dt: any) => {
          let load = this.dataService.decrypt(dt.a);
          // console.log(load);
          this.obj_flowers = load.payload.data;
          // console.log(this.obj_flowers);
          this.bouquet_loop();
        },
        (er) => {
          console.log('Invalid Inputs', er);
        }
      );
  }

  getFlower() {
    this.dataService
      .processData(btoa('get_flowers').replace('=', ''), null, 2)!
      .subscribe(
        (dt: any) => {
          let load = this.dataService.decrypt(dt.a);
          // console.log(load);
          this.flowers = load.payload.data;
          // console.log(this.flowers);
          this.flower_loop();
        },
        (er) => {
          console.log('Invalid Inputs', er);
        }
      );
  }

  public async doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);

    console.log('Async operation has ended');
  }

  flower_loop() {
    for (let i = 0; i < this.flowers.length; i++) {
      if (this.flowers[i]['flower_name'] == null) {
        console.log('none');
      } else {
        this.order_flowers.push({
          image:
            'http://bloompod.api.gc-ecommerceapp.com/bloompod_api/flowers/' +
            this.flowers[i]['flower_name'] +
            '.png',
          thumbImage:
            'http://bloompod.api.gc-ecommerceapp.com/bloompod_api/flowers/' +
            this.flowers[i]['flower_name'] +
            '.png',
          title:
            this.flowers[i]['flower_name'] +
            '- ₱' +
            this.flowers[i]['flower_price'],
        });
      }
    }
    // console.log(this.order_flowers);
  }

  public async about() {
    const popover = await this.popoverController.create({
      component: AboutPage,
      cssClass: 'my-custom-class2',
      translucent: true,
    });
    await popover.present();

    const data = await popover.onWillDismiss();
  }
}
