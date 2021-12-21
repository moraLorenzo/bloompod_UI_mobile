import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { FlowersService } from 'src/app/services/flower.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
})
export class GeneratePage implements OnInit {
  topFlowers: any;

  primary: any;
  primary_price: any;

  secondary: any;
  secondary_price: any;

  tertiary: any;
  tertiary_price: any;

  labelText: any;

  cpt = 0;

  combination: any;
  content: any;

  Flowers: any;

  floral = [];
  option: any;
  permutations: any;
  orders: any;
  user_obj: any;

  userId: any;

  total: number = 0;

  constructor(
    private fs: FlowersService,
    private elementRef: ElementRef,
    private dataService: DataService,
    private router: Router,
    private userService: UserService
  ) {}

  ionViewWillEnter() {
    console.log(history.state.data);
    this.primary = history.state.data.flower_name;
    this.primary_price = history.state.data.price;
    this.option = history.state.data.quantity;
    this.user_obj = this.userService.getUser();
    this.userId = this.user_obj.user_id;
    this.dataService
      .processData(btoa('get_flowers').replace('=', ''), null, 2)
      .subscribe(
        (dt: any) => {
          let load = this.dataService.decrypt(dt.a);
          // console.log(load);
          this.Flowers = load.payload.data;
          for (let i = 0; i < this.Flowers.length; i++) {
            // console.log(this.Flowers[i]['flower_name']);
            this.floral.push(this.Flowers[i]['flower_name']);
          }

          this.getOrders(this.userId);
        },
        (er) => {
          console.log('Invalid Inputs', er);
        }
      );
  }

  ngOnInit() {}

  gen() {
    console.log('meh');
    if (this.option == 6) {
      if (this.cpt < this.floral.length - 1) {
        this.cpt++;
      } else {
        this.cpt = 0;
      }
      this.topFlowers = this.fs.six(this.primary, this.floral[this.cpt]);
      this.content = this.topFlowers;

      this.floral.forEach((element) => {
        // console.log(element);
        if (element == this.floral[this.cpt]) {
          // finding price of secondary flower
          console.log(element);
          this.Flowers.forEach((secondary) => {
            console.log(secondary);

            if (secondary.flower_name == element) {
              this.secondary_price = secondary.flower_price;
              console.log(secondary.flower_name);
            }
          });
        }
      });
      this.secondary = this.floral[this.cpt];

      this.total = this.primary_price * 3;
      this.total += +this.secondary_price * 3;
      this.total += 350;
    } else if (this.option == 9) {
      if (this.cpt < this.floral.length - 1) {
        this.cpt++;
      } else {
        this.cpt = 0;
      }
      this.topFlowers = this.fs.nine(this.primary, this.floral[this.cpt]);
      this.content = this.topFlowers;

      this.floral.forEach((element) => {
        // console.log(element);
        if (element == this.floral[this.cpt]) {
          // finding price of secondary flower
          console.log(element);
          this.Flowers.forEach((secondary) => {
            console.log(secondary);

            if (secondary.flower_name == element) {
              this.secondary_price = secondary.flower_price;
              console.log(secondary.flower_name);
            }
          });
        }
      });
      this.secondary = this.floral[this.cpt];

      console.log('Seconday Price: ', this.primary_price);

      this.total = this.primary_price * 3;
      this.total += +this.secondary_price * 6;
      this.total += 350;
    } else if (this.option == 12) {
      if (this.cpt < this.permutations.length - 1) {
        this.cpt++;
      } else {
        this.cpt = 0;
      }

      this.permutations.forEach((element) => {
        if (element == this.permutations[this.cpt]) {
          // finding price of secondary flower

          this.Flowers.forEach((secondary) => {
            if (secondary.flower_name == element[0]) {
              this.secondary_price = secondary.flower_price;
            }
          });
          // finding price of tertiary flower
          this.Flowers.forEach((tertiary) => {
            if (tertiary.flower_name == element[1]) {
              this.tertiary_price = tertiary.flower_price;
            }
          });
        }
      });

      this.total = this.primary_price * 4;
      this.total += +this.secondary_price * 4;
      this.total += +this.tertiary_price * 4;
      this.total += 350;

      this.topFlowers = this.fs.twelve(
        this.primary,
        this.permutations[this.cpt]
      );
      this.secondary = this.permutations[this.cpt][0];
      this.tertiary = this.permutations[this.cpt][1];
      this.content = this.topFlowers;
    }
  }

  permutation(list, maxLen) {
    // Copy initial values as arrays
    var perm = list.map(function (val) {
      return [val];
    });
    // Our permutation generator
    var generate = function (perm, maxLen, currLen) {
      // Reached desired length
      if (currLen === maxLen) {
        return perm;
      }
      // For each existing permutation
      for (var i = 0, len = perm.length; i < len; i++) {
        var currPerm = perm.shift();
        // Create new permutation
        for (var k = 0; k < list.length; k++) {
          perm.push(currPerm.concat(list[k]));
        }
      }
      // Recurse
      return generate(perm, maxLen, currLen + 1);
    };
    // Start with size 1 because of initial values
    return generate(perm, maxLen, 1);
  }

  confirm() {
    if (this.option == 6) {
      let price = 0;

      console.log(this.primary, this.primary_price);

      this.Flowers.forEach((element) => {
        if (element.flower_name == this.floral[this.cpt]) {
          price = element.flower_price;
        }
      });

      console.log(this.floral[this.cpt], price);

      this.router.navigate(['confirmation'], {
        state: {
          data: {
            quantity: 6,
            primary: this.primary,
            primary_price: this.primary_price,
            secondary: this.floral[this.cpt],
            secondary_price: price,
          },
        },
      });
    } else if (this.option == 9) {
      let price = 0;

      console.log(this.primary, this.primary_price);

      this.Flowers.forEach((element) => {
        if (element.flower_name == this.floral[this.cpt]) {
          price = element.flower_price;
        }
      });

      console.log(this.floral[this.cpt], price);
      this.router.navigate(['confirmation'], {
        state: {
          data: {
            quantity: 9,
            primary: this.primary,
            primary_price: this.primary_price,
            secondary: this.floral[this.cpt],
            secondary_price: price,
          },
        },
      });
    } else if (this.option == 12) {
      // console.log(this.primary);
      // console.log(this.primary_price);

      // console.log(this.permutations[this.cpt]);

      let secondary_price = 0;
      let tertiary_price = 0;

      console.log(this.primary, this.primary_price);

      // console.log(this.permutations[this.cpt]);
      this.permutations.forEach((element) => {
        if (element == this.permutations[this.cpt]) {
          // finding price of secondary flower

          this.Flowers.forEach((secondary) => {
            if (secondary.flower_name == element[0]) {
              secondary_price = secondary.flower_price;
            }
          });
          // finding price of tertiary flower
          this.Flowers.forEach((tertiary) => {
            if (tertiary.flower_name == element[1]) {
              tertiary_price = tertiary.flower_price;
            }
          });
        }
      });
      console.log('Secondary: ', secondary_price);
      console.log('Tertiary: ', tertiary_price);

      this.router.navigate(['confirmation'], {
        state: {
          data: {
            quantity: 12,
            primary: this.primary,
            primary_price: this.primary_price,
            secondary: this.permutations[this.cpt][0],
            secondary_price: secondary_price,
            tertiary: this.permutations[this.cpt][1],
            tertiary_price: tertiary_price,
          },
        },
      });
    }
  }

  back() {
    this.router.navigate(['custom']);
  }

  sortByFrequency(array) {
    var frequency = {};

    array.forEach(function (value) {
      frequency[value] = 0;
    });

    var uniques = array.filter(function (value) {
      return ++frequency[value] == 1;
    });

    return uniques.sort(function (a, b) {
      return frequency[b] - frequency[a];
    });
  }

  getOrders(id) {
    this.orders = [];
    let user_id = id;

    this.dataService
      .processData(btoa('getMyOrders').replace('=', ''), { user_id }, 2)
      .subscribe((dt: any) => {
        let load = this.dataService.decrypt(dt.a);
        console.log(load);
        try {
          // this.orders = load.payload.orders.reverse();

          for (let i = 0; i < load.payload.orders.length; i++) {
            if (load.payload.orders[i]['main_flower'] == null) {
              console.log('none');
            } else {
              this.orders.push(load.payload.orders[i]['main_flower']);
            }
          }

          // console.log(this.Flowers);
          // console.log(this.orders);
          // console.log(this.sortByFrequency(this.orders));
          let chars = this.orders;
          // let uniqueChars = [...new Set(chars)];
          let uniqueChars = this.sortByFrequency(this.orders).reverse();

          console.log(uniqueChars);

          if (uniqueChars.length == 0) {
            this.set();
          } else {
            for (let i = 0; i < uniqueChars.length; i++) {
              this.checkFirst(uniqueChars[i]);
            }
          }
        } catch (err) {
          console.log(err);
          this.set();
        }
        // console.log(load);
        // this.status = this.orders[0].order_status;
      });
  }

  checkFirst(char) {
    console.log(char);

    for (let i = 0; i < this.floral.length; i++) {
      if (this.floral[i] == char) {
        this.floral.splice(i, 1);

        this.floral.unshift(char);
      } else {
        console.log('none');
      }
    }

    console.log(this.floral);

    this.permutations = this.permutation(this.floral, 2);
    // console.log(this.permutations);
    // console.log(this.floral[0]);

    if (this.option == 6) {
      this.topFlowers = this.fs.six(this.primary, this.floral[this.cpt]);
      this.content = this.topFlowers;
      this.secondary = this.floral[this.cpt];
      // console.log('Secondary Price: ', this.floral[this.cpt]);
      // console.log('Primary Price: ', this.primary_price);

      this.floral.forEach((element) => {
        if (element == this.floral[this.cpt]) {
          // finding price of secondary flower

          this.Flowers.forEach((secondary) => {
            if (secondary.flower_name == element) {
              this.secondary_price = secondary.flower_price;
            }
          });
        }
      });

      this.total = this.primary_price * 3;
      this.total += +this.secondary_price * 3;
      this.total += 350;
    } else if (this.option == 9) {
      this.topFlowers = this.fs.nine(this.primary, this.floral[this.cpt]);
      this.content = this.topFlowers;
      this.secondary = this.floral[this.cpt];
      // console.log('Primary Price: ', this.primary_price);
      // console.log('Secondary Price: ', this.floral[this.cpt]);

      this.floral.forEach((element) => {
        if (element == this.floral[this.cpt]) {
          // finding price of secondary flower

          this.Flowers.forEach((secondary) => {
            if (secondary.flower_name == element) {
              this.secondary_price = secondary.flower_price;
            }
          });
        }
      });

      console.log('Seconday Price: ', this.primary_price);

      this.total = this.primary_price * 3;
      this.total += +this.secondary_price * 6;
      this.total += 350;
    } else if (this.option == 12) {
      this.permutations.forEach((element) => {
        if (element == this.permutations[this.cpt]) {
          // finding price of secondary flower

          this.Flowers.forEach((secondary) => {
            if (secondary.flower_name == element[0]) {
              this.secondary_price = secondary.flower_price;
            }
          });
          // finding price of tertiary flower
          this.Flowers.forEach((tertiary) => {
            if (tertiary.flower_name == element[1]) {
              this.tertiary_price = tertiary.flower_price;
            }
          });
        }
      });

      console.log('Seconday Price: ', this.primary_price);
      console.log('Tertiary Price: ', this.tertiary_price);

      this.total = this.primary_price * 4;
      this.total += +this.secondary_price * 4;
      this.total += +this.tertiary_price * 4;
      this.total += 350;
      this.topFlowers = this.fs.twelve(
        this.primary,
        this.permutations[this.cpt]
      );

      this.secondary = this.permutations[this.cpt][0];
      this.tertiary = this.permutations[this.cpt][1];
      this.content = this.topFlowers;
    }
  }

  set() {
    console.log(this.permutation(this.floral, 2));
    //Setup All Combinations with repetition
    this.permutations = this.permutation(this.floral, 2);
    // console.log(this.permutations);
    // console.log(this.floral[0]);

    if (this.option == 6) {
      this.topFlowers = this.fs.six(this.primary, this.floral[this.cpt]);
      this.content = this.topFlowers;
    } else if (this.option == 9) {
      this.topFlowers = this.fs.nine(this.primary, this.floral[this.cpt]);
      this.content = this.topFlowers;
    } else if (this.option == 12) {
      this.topFlowers = this.fs.twelve(
        this.primary,
        this.permutations[this.cpt]
      );
      this.content = this.topFlowers;
    }
  }

  add_to_cart() {
    let user_id = this.userId;
    let order_flower = 'Generated Flower Bouquet';
    let main_flower = this.primary;
    console.log(this.secondary);
    let secondary_flower = this.secondary;
    let tertiary_flower = this.tertiary;
    let order_totalprice = this.total;
    let quantity = this.option;
    if (this.option == 6 || this.option == 9) {
      this.dataService
        .processData(
          btoa('add_to_cart').replace('=', ''),
          {
            user_id,
            order_flower,
            quantity,
            main_flower,
            secondary_flower,
            tertiary_flower: null,
            order_totalprice,
          },
          2
        )
        .subscribe(
          (dt: any) => {
            // console.log(dt.a);
            let load = this.dataService.decrypt(dt.a);
            console.log(load);
            this.router.navigate(['tabs/tab4']);
          },
          (er) => {
            console.log('Invalid Inputs');
          }
        );
    } else if (this.option == 12) {
      this.dataService
        .processData(
          btoa('add_to_cart').replace('=', ''),
          {
            user_id,
            order_flower,
            quantity,
            main_flower,
            secondary_flower,
            tertiary_flower,
            order_totalprice,
          },
          2
        )
        .subscribe(
          (dt: any) => {
            // console.log(dt.a);
            let load = this.dataService.decrypt(dt.a);
            console.log(load);
            // this.router.navigate(['tabs/tab4']);

            this.router.navigateByUrl('/tabs/tab4', {
              skipLocationChange: true,
            });

            // this.navCtrl.navigateRoot('/tabs/tab4');
          },
          (er) => {
            console.log('Invalid Inputs');
          }
        );
    }
  }

  mode() {
    this.router.navigate(['mode'], {
      state: {
        data: {
          primary: this.primary,
          primary_price: this.primary_price,
          secondary: this.secondary,
          secondary_price: this.secondary_price,
          tertiary: this.tertiary,
          tertiary_price: this.tertiary_price,
          quantity: this.option,
          total: this.total,
        },
      },
    });
  }
}
