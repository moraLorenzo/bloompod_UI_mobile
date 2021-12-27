import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { NgImageSliderModule } from 'ng-image-slider';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
// import { SwiperModule } from 'swiper/angular';
import { IvyCarouselModule } from 'angular-responsive-carousel';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    NgImageSliderModule,
    IvyCarouselModule,
    CarouselModule,
    ButtonModule,
    ToastModule,
  ],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
