import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ToastController,
  LoadingController,
  PopoverController,
} from '@ionic/angular';
import { OTPPage } from '../popovers/otp/otp.page';
import { DataService } from '../services/data/data.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  passwordType: string = 'password';
  passwordIcon: string = 'visibility_off';
  isAccepted: boolean = false;
  OTP: any;
  checkBox: boolean = false;

  constructor(
    private _router: Router,
    private dataService: DataService,
    public toastController: ToastController,
    private userService: UserService,
    public popoverController: PopoverController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.userService.isUserLoggedIn()) {
      this._router.navigate(['tabs']);
    }
  }

  navReg() {
    this.email = '';
    this.password = '';
    this._router.navigate(['register']);
  }

  async presentLoading(token) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-login',
      message:
        '<ion-img src="../../assets/icon/Bloom.png" alt="loading..." class="rotate"></ion-img><br/> <p>Logging in...</p>',
      translucent: true,
      showBackdrop: false,
      spinner: null,
    });

    // console.log('Loading dismissed!');

    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon =
      this.passwordIcon === 'visibility_off' ? 'visibility' : 'visibility_off';
  }

  async onSubmit(e) {
    e.preventDefault();

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-login',
      message:
        '<ion-img src="../../assets/icon/Bloom1.png" alt="loading..." class="rotate"></ion-img><br/> <p>Logging in...</p>',
      translucent: true,
      showBackdrop: false,
      spinner: null,
    });

    await loading.present();

    let f = e.target.elements;
    let email = e.target[0].value;
    let password = e.target[1].value;

    this.dataService
      .processData(btoa('login').replace('=', ''), { email, password }, 2)
      .subscribe(
        (dt: any) => {
          let load = this.dataService.decrypt(dt.a);

          if (load.status['remarks'] == 'success') {
            this.userService.setUser(load.payload.name[0]);
            loading.dismiss();
            this._router.navigate(['tabs']);
            e.target.reset();
          } else if (
            load.status['remarks'] == 'failed' &&
            load.status['message'] == 'Email not yet verified'
          ) {
            loading.dismiss();
            this.presentToast(load.status['message']);
            this.presentPopover();
          } else if (
            load.status['remarks'] == 'failed' &&
            load.status['message'] == 'Incorrect username or password'
          ) {
            loading.dismiss();
            this.presentToast(load.status['message']);
          }
        },
        (er) => {
          loading.dismiss();
          this.presentToast('Invalid Login Credentials');
        }
      );

    const { role, data } = await loading.onDidDismiss();
  }

  back() {
    this._router.navigate(['tabs/tab2']);
  }

  public async presentPopover() {
    const popover = await this.popoverController.create({
      component: OTPPage,
      cssClass: 'my-custom-class',
      translucent: true,
    });
    await popover.present();

    const data = await popover.onWillDismiss();

    if (data['data']['OTP']) {
      this.OTP = data['data']['OTP'];

      this.user_OTP();
    } else {
      this.presentToast('Required input');
    }
  }

  user_OTP() {
    console.log(this.email);
    this.dataService
      .processData(
        btoa('otp').replace('=', ''),
        { otp: this.OTP, email: this.email },
        2
      )
      .subscribe(
        (dt: any) => {
          let load = this.dataService.decrypt(dt.a);
          // console.log(load.status);

          if (load.status['remarks'] == 'success') {
            this.userService.setUser(load.payload.name[0]);

            this._router.navigate(['tabs']);
          } else if (load.status['remarks'] == 'failed') {
            this.presentToast(load.status['message']);
            this.presentPopover();
          }
        },
        (er) => {
          this.presentToast('Invalid Inputs OTP');
        }
      );
  }

  onChange() {
    console.log(this.checkBox);
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  }
}
