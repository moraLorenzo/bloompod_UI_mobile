import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.page.html',
  styleUrls: ['./mode.page.scss'],
})
export class ModePage implements OnInit {
  order_obj: any;
  mode: string = 'Pick Up';
  time: string = '';
  userId: any;
  user_obj: any;

  municipality: string = 'Olongapo City';

  barangays = [
    { name: 'Asinan' },
    { name: 'Banicain' },
    { name: 'Barretto' },
    { name: 'East Bajac-Bajac' },
    { name: 'East Tapinac' },
    { name: 'Gordon Heights' },
    { name: 'Kababae' },
    { name: 'Kalaklan' },
    { name: 'Kalalake' },
    { name: 'Mabayuan' },
    { name: 'New Cabalan' },
    { name: 'New Ilalim' },
    { name: 'Old Cabalan' },
    { name: 'Pag-Asa' },
    { name: 'Sta. Rita' },
    { name: 'West Bajac-Bajac' },
    { name: 'West Tapinac' },
  ];

  subic = [
    { name: 'Aningway Sacatihan' },
    { name: 'Asinan Poblacion' },
    { name: 'Asinan Proper' },
    { name: 'Baraca-Camachile' },
    { name: 'Batiawan' },
    { name: 'Calapacuan' },
    { name: 'Calapandayan' },
    { name: 'Cawag' },
    { name: 'Ilwas' },
    { name: 'Mangan-Vaca' },
    { name: 'Matain' },
    { name: 'Naugsol' },
    { name: 'Pamatawan' },
    { name: 'San Isidro' },
    { name: 'Santo Tomas' },
    { name: 'Wawandue' },
  ];

  olongapo = [
    { name: 'Asinan' },
    { name: 'Banicain' },
    { name: 'Barretto' },
    { name: 'East Bajac-Bajac' },
    { name: 'East Tapinac' },
    { name: 'Gordon Heights' },
    { name: 'Kababae' },
    { name: 'Kalaklan' },
    { name: 'Kalalake' },
    { name: 'Mabayuan' },
    { name: 'New Cabalan' },
    { name: 'New Ilalim' },
    { name: 'Old Cabalan' },
    { name: 'Pag-Asa' },
    { name: 'Sta. Rita' },
    { name: 'West Bajac-Bajac' },
    { name: 'West Tapinac' },
  ];

  selectedValue = null;

  constructor(
    public router: Router,
    private dataService: DataService,
    private userService: UserService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.user_obj = this.userService.getUser();
    this.userId = this.user_obj.user_id;
    this.order_obj = history.state.data;
    console.log(history.state.data);
    // console.log(history.state.data.order);
  }

  onChange(deviceValue: any) {
    console.log(deviceValue);
    this.mode = deviceValue;
  }

  timeChange(deviceValue: any) {
    console.log(deviceValue);
    this.time = deviceValue;
  }

  change(deviceValue: any) {
    console.log(deviceValue);
    this.municipality = deviceValue;

    if (deviceValue == 'Subic') {
      this.barangays = this.subic;
    } else if (deviceValue == 'Olongapo City') {
      this.barangays = this.olongapo;
    }
  }

  barangayChange(deviceValue: any) {
    console.log(deviceValue);
  }

  tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    console.log(time.join(''));
    return time.join(''); // return adjusted time or original string
  }

  async onSubmit(e: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention!',
      message:
        'Do you confirm that before proceeding you have checked all the information given with no typographical error?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Yes',
          handler: async () => {
            const loading = await this.loadingController.create({
              cssClass: 'my-custom-class-login',
              message:
                '<ion-img src="../../assets/icon/Bloom1.png" alt="loading..." class="rotate"></ion-img><br/> <p>Processing...</p>',
              translucent: true,
              showBackdrop: false,
              spinner: null,
            });

            await loading.present();

            var today = new Date();
            var date =
              today.getFullYear() +
              '-' +
              (today.getMonth() + 1) +
              '-' +
              today.getDate();

            date = this.formatDate(date);

            e.preventDefault();

            if (date < e.target[6].value) {
              var desiredTime = this.tConvert(e.target[7].value);
              let user_id = this.userId;
              let order_flower = 'Generated Flower Bouquet';
              let main_flower = this.order_obj.primary;
              let secondary_flower = this.order_obj.secondary;
              let tertiary_flower = this.order_obj.tertiary;
              let quantity = this.order_obj.quantity;
              let order_totalprice = this.order_obj.total + 50;
              console.log(order_totalprice);
              let order_id = this.order_obj.order_id;

              let order_payment = this.mode;
              let order_time = desiredTime;
              let order_date = e.target[6].value;

              let order_recipient = e.target[0].value;

              let order_address =
                e.target[2].value +
                ', ' +
                e.target[3].value +
                ', ' +
                e.target[1].value;
              let order_landmark = e.target[4].value;
              let order_contact = e.target[5].value;

              let order_message = e.target[8].value;
              // let order_purpose = e.target[9].value;
              let order_purpose = '';
              if (quantity == 6 || quantity == 9) {
                tertiary_flower = null;
              }
              if (order_id == null) {
                order_id = 'null';
              }
              this.dataService
                .processData(
                  btoa('checkout').replace('=', ''),
                  {
                    user_id,
                    order_id,
                    order_flower,
                    main_flower,
                    secondary_flower,
                    tertiary_flower,
                    quantity,
                    order_totalprice,
                    order_recipient,
                    order_payment,
                    order_date,
                    order_time,
                    order_landmark,
                    order_address,
                    order_message,
                    order_purpose,
                    order_contact,
                  },
                  2
                )
                .subscribe(
                  (dt: any) => {
                    // console.log(dt.a);
                    let load = this.dataService.decrypt(dt.a);
                    // console.log(order_totalprice);
                    // console.log(load.status);
                    loading.dismiss();
                    this.presentToast('Order Placed');

                    this.router.navigate(['tabs/tab1']);
                  },
                  (er) => {
                    loading.dismiss();
                    console.log('Invalid Inputs');
                  }
                );
            } else if (date == e.target[6].value) {
              // var time = today.toLocaleTimeString('en-US', {
              //   hour12: false,
              //   hour: 'numeric',
              //   minute: 'numeric',
              // });

              var sample = new Date().getTime() + 2 * 60 * 60 * 1000; // get your number
              var datez = new Date(sample); // create Date object

              var time = datez.toLocaleTimeString('en-US', {
                hour12: false,
                hour: 'numeric',
                minute: 'numeric',
              });

              var desiredTime = this.tConvert(e.target[7].value);

              console.log(time);
              console.log(desiredTime);

              if (time < e.target[7].value) {
                console.log(desiredTime);
                console.log(time);
                let user_id = this.userId;
                let order_flower = 'Generated Flower Bouquet';
                let main_flower = this.order_obj.primary;
                let secondary_flower = this.order_obj.secondary;
                let tertiary_flower = this.order_obj.tertiary;
                let quantity = this.order_obj.quantity;
                let order_totalprice = this.order_obj.total + 50;
                let order_id = this.order_obj.order_id;
                let order_payment = this.mode;

                let order_time = desiredTime;
                let order_date = e.target[6].value;

                let order_recipient = e.target[0].value;

                let order_address =
                  e.target[2].value +
                  ', ' +
                  e.target[3].value +
                  ', ' +
                  e.target[1].value;
                let order_landmark = e.target[4].value;
                let order_contact = e.target[5].value;

                let order_message = e.target[8].value;
                // let order_purpose = e.target[9].value;
                let order_purpose = '';
                if (quantity == 6 || quantity == 9) {
                  tertiary_flower = null;
                }
                if (order_id == null) {
                  order_id = 'null';
                }
                this.dataService
                  .processData(
                    btoa('checkout').replace('=', ''),
                    {
                      user_id,
                      order_flower,
                      order_id,
                      main_flower,
                      secondary_flower,
                      tertiary_flower,
                      quantity,
                      order_totalprice,
                      order_recipient,
                      order_payment,
                      order_date,
                      order_time,
                      order_landmark,
                      order_address,
                      order_message,
                      order_purpose,
                      order_contact,
                    },
                    2
                  )
                  .subscribe(
                    (dt: any) => {
                      // console.log(dt.a);
                      let load = this.dataService.decrypt(dt.a);
                      // console.log(load.status);
                      loading.dismiss();
                      this.presentToast('Order Placed');

                      this.router.navigate(['tabs/tab1']);
                    },
                    (er) => {
                      loading.dismiss();
                      console.log('Invalid Inputs');
                    }
                  );
              } else {
                loading.dismiss();
                this.presentToast('No time for the florist');
              }
            } else {
              loading.dismiss();
              this.presentToast('Invalid date');
            }
            const { role, data } = await loading.onDidDismiss();
          },
        },
      ],
    });

    await alert.present();
  }

  async pickSubmit(e: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention!',
      message:
        'Do you confirm that before proceeding you have checked all the information given with no typographical errors?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Yes',
          handler: async () => {
            const loading = await this.loadingController.create({
              cssClass: 'my-custom-class-login',
              message:
                '<ion-img src="../../assets/icon/Bloom1.png" alt="loading..." class="rotate"></ion-img><br/> <p>Processing...</p>',
              translucent: true,
              showBackdrop: false,
              spinner: null,
            });

            await loading.present();

            var today = new Date();
            var date =
              today.getFullYear() +
              '-' +
              (today.getMonth() + 1) +
              '-' +
              today.getDate();

            date = this.formatDate(date);

            e.preventDefault();

            if (date < e.target[0].value) {
              let user_id = this.userId;
              let order_flower = 'Generated Flower Bouquet';
              let main_flower = this.order_obj.primary;
              let secondary_flower = this.order_obj.secondary;
              let tertiary_flower = this.order_obj.tertiary;
              let quantity = this.order_obj.quantity;
              let order_totalprice = this.order_obj.total;
              let order_id = this.order_obj.order_id;
              let order_payment = this.mode;
              let address = null;
              let order_time = this.tConvert(e.target[1].value);
              let order_date = e.target[0].value;
              let order_address = null;
              let order_landmark = null;
              let order_contact = e.target[2].value;

              let order_message = e.target[3].value;
              // let order_purpose = e.target[4].value;
              let order_purpose = '';

              if (quantity == 6 || quantity == 9) {
                tertiary_flower = null;
              }
              if (order_id == null) {
                order_id = 'null';
              }
              this.dataService
                .processData(
                  btoa('checkout').replace('=', ''),
                  {
                    user_id,
                    order_flower,
                    main_flower,
                    order_id,
                    secondary_flower,
                    tertiary_flower,
                    quantity,
                    order_totalprice,
                    order_payment,
                    address,
                    order_date,
                    order_time,
                    order_landmark,
                    order_address,
                    order_message,
                    order_purpose,
                    order_contact,
                  },
                  2
                )
                .subscribe(
                  (dt: any) => {
                    // console.log(dt.a);
                    let load = this.dataService.decrypt(dt.a);
                    // console.log(load.status);

                    loading.dismiss();
                    this.presentToast('Order Placed');

                    this.router.navigate(['tabs/tab1']);
                  },
                  (er) => {
                    loading.dismiss();
                    console.log('Invalid Inputs');
                  }
                );
            } else if (date == e.target[0].value) {
              var sample = new Date().getTime() + 2 * 60 * 60 * 1000; // get your number
              var datez = new Date(sample); // create Date object

              var time = datez.toLocaleTimeString('en-US', {
                hour12: false,
                hour: 'numeric',
                minute: 'numeric',
              });
              var desiredTime = this.tConvert(e.target[1].value);

              if (time < e.target[1].value) {
                console.log(desiredTime);
                let user_id = this.userId;
                let order_flower = 'Generated Flower Bouquet';
                let main_flower = this.order_obj.primary;
                let secondary_flower = this.order_obj.secondary;
                let tertiary_flower = this.order_obj.tertiary;
                let quantity = this.order_obj.quantity;
                let order_totalprice = this.order_obj.total;
                let order_id = this.order_obj.order_id;
                let order_payment = this.mode;
                let address = null;
                let order_time = this.tConvert(e.target[1].value);
                let order_date = e.target[0].value;

                let order_address = null;
                let order_landmark = null;
                let order_contact = e.target[2].value;

                let order_message = e.target[3].value;
                // let order_purpose = e.target[4].value;
                let order_purpose = '';
                console.log(e.target[2].value);
                if (quantity == 6 || quantity == 9) {
                  tertiary_flower = null;
                }
                if (order_id == null) {
                  order_id = 'null';
                }
                this.dataService
                  .processData(
                    btoa('checkout').replace('=', ''),
                    {
                      user_id,
                      order_flower,
                      main_flower,
                      order_id,
                      secondary_flower,
                      tertiary_flower,
                      quantity,
                      order_totalprice,
                      order_payment,
                      address,
                      order_date,
                      order_time,
                      order_landmark,
                      order_address,
                      order_message,
                      order_purpose,
                      order_contact,
                    },
                    2
                  )
                  .subscribe(
                    (dt: any) => {
                      // console.log(dt.a);
                      let load = this.dataService.decrypt(dt.a);
                      loading.dismiss();
                      // console.log(load.status.message);
                      this.presentToast('Order Placed');

                      this.router.navigate(['tabs/tab1']);
                    },
                    (er) => {
                      loading.dismiss();
                      console.log('Invalid Inputs');
                    }
                  );
              } else {
                loading.dismiss();
                this.presentToast('No time for the florist');
              }
            } else {
              loading.dismiss();
              this.presentToast('Invalid date');
            }
            const { role, data } = await loading.onDidDismiss();
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

  back() {
    this.router.navigate(['custom']);
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
