import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-quick',
  templateUrl: './quick.page.html',
  styleUrls: ['./quick.page.scss'],
})
export class QuickPage implements OnInit {
  Flowers: any;
  flower_obj: any;

  prices = [];
  //To be continued
  constructor(
    private dataService: DataService,
    private router: Router,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.dataService
      .processData(btoa('get_bouquets').replace('=', ''), null, 2)
      .subscribe(
        (dt: any) => {
          let load = this.dataService.decrypt(dt.a);
          console.log(load);
          this.Flowers = load.payload.data;
          this.flower_obj = load.payload.data;
        },
        (er) => {
          console.log('Invalid Inputs', er);
        }
      );
  }

  onChange(value: any) {
    // console.log(value);

    if (value == 1) {
      this.Flowers = this.flower_obj.filter((x: any) => x.quick_price < 300);
    } else if (value == 2) {
      this.Flowers = this.flower_obj.filter(
        (x: any) => x.quick_price >= 300 && x.quick_price < 600
      );
    } else if (value == 3) {
      this.Flowers = this.flower_obj.filter(
        (x: any) => x.quick_price >= 600 && x.quick_price < 800
      );
    } else if (value == 4) {
      this.Flowers = this.flower_obj.filter((x: any) => x.quick_price >= 800);
    } else {
      this.Flowers = this.flower_obj;
    }
  }

  confirm(obj: any) {
    console.log(obj);
    this.router.navigate(['quickconfirm'], {
      state: {
        data: obj,
      },
    });
  }

  back() {
    this.router.navigate(['tabs/tab2']);
  }
}
