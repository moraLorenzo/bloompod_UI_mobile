import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.page.html',
  styleUrls: ['./completed.page.scss'],
})
export class CompletedPage implements OnInit {
  orders: any;
  user_obj: any;
  userId: any;
  res: any;
  show = false;
  constructor(
    private userService: UserService,
    public router: Router,
    public dataService: DataService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.user_obj = this.userService.getUser();
    this.userId = this.user_obj.user_id;
  }

  ionViewWillEnter() {
    this.show = false;
    // this.orders = history.state.data.order;
    // console.log(this.orders);
    this.getCompleted(this.userId);
  }

  navHistory(order) {
    console.log(order);
  }

  back() {
    this.router.navigate(['tabs/tab4']);
  }

  getCompleted(id) {
    this.orders = [];
    let user_id = id;
    // console.log(user_id);
    this.dataService
      .processData(btoa('getCompletedStatus').replace('=', ''), { user_id }, 2)
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
