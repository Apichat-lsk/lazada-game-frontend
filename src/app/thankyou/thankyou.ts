import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-thankyou',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './thankyou.html',
  styleUrl: './thankyou.css',
})
export class Thankyou {
  constructor(private router: Router, private location: Location) {
    this.location.replaceState('');
  }
  gotoLazada() {
    window.open(
      'https://pages.lazada.co.th/wow/gcp/route/lazada/th/upr_1000345_lazada/channel/th/upr-router/th?hybrid=1&data_prefetch=true&prefetch_replace=1&at_iframe=1&wh_pid=/lazada/megascenario/th/99megabrandssale/lazjury',
      '_blank'
    );
  }
  Direct(path: string) {
    this.router.navigate([path]);
  }
}
