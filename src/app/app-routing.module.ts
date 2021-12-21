import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  //   // loadChildren: () =>
  //   //   import('./login/login.module').then((m) => m.LoginPageModule),
  // },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterPageModule),
  },
  // {
  //   path: 'tab4',
  //   loadChildren: () =>
  //     import('./tab4/tab4.module').then((m) => m.Tab4PageModule),
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'custom',
    loadChildren: () =>
      import('./flowers/custom/custom.module').then((m) => m.CustomPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'quick',
    loadChildren: () =>
      import('./flowers/quick/quick.module').then((m) => m.QuickPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'otp',
    loadChildren: () =>
      import('./popovers/otp/otp.module').then((m) => m.OTPPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'custom/generate',
    loadChildren: () =>
      import('./flowers/generate/generate.module').then(
        (m) => m.GeneratePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'confirmation',
    loadChildren: () =>
      import('./confirmation/confirmation.module').then(
        (m) => m.ConfirmationPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'mode',
    loadChildren: () =>
      import('./mode/mode/mode.module').then((m) => m.ModePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'toPay',
    loadChildren: () =>
      import('./pages/to-pay/to-pay.module').then((m) => m.ToPayPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'completed',
    loadChildren: () =>
      import('./pages/completed/completed.module').then(
        (m) => m.CompletedPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'service',
    loadChildren: () =>
      import('./pages/service/service.module').then((m) => m.ServicePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'confirmcart',
    loadChildren: () =>
      import('./pages/confirmcart/confirmcart.module').then(
        (m) => m.ConfirmcartPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'quickconfirm',
    loadChildren: () =>
      import('./flowers/quickconfirm/quickconfirm.module').then(
        (m) => m.QuickconfirmPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'quickmode',
    loadChildren: () =>
      import('./flowers/quickmode/quickmode.module').then(
        (m) => m.QuickmodePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'payment-confirmation',
    loadChildren: () =>
      import('./pages/payment-confirmation/payment-confirmation.module').then(
        (m) => m.PaymentConfirmationPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'terms',
    loadChildren: () =>
      import('./modal/terms/terms.module').then((m) => m.TermsPageModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./modal/about/about.module').then((m) => m.AboutPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
