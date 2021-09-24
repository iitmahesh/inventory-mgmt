import { Observable } from 'rxjs';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  isActive_index: any;
  menuPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      name: 'podium-outline'
    },
    {
      title: 'Purchase',
      url: '/purchase',
      name: 'cart'
    },
    {
      title: 'Sales Order',
      url: '/sales-order',
      name: 'cart'
    },
    {
      title: 'Sales',
      url: '/sales',
      name: 'pricetags'
    },
    {
      title: 'Inventory',
      url: '/inventory',
      name: 'albums'
    },
    {
      title: 'Suppliers Summary',
      url: '/suppliers',
      name: 'bag-handle'
    },
    {
      title: 'Customers Summary',
      url: '/customers',
      name: 'people'
    },
    {
      title: 'Settings',
      name: 'settings',
      open: false,
      childrens: [
        {
          title: 'Customer',
          url: '/settings/customer',
          name: 'people'
        },
        {
          title: 'Supplier',
          url: '/settings/supplier',
          name: 'file-tray-full'
        },
        {
          title: 'Product',
          url: '/settings/product',
          name: 'construct'
        }
      ]
    },
    {
      title: 'Sign Out',
      url: '/sign-out',
      name: 'people'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    setInterval(() => {
      console.log('Hi Iam here now Haha haha ahaha......', new Date());
    }, 60000);
  }
}
