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

  Direct(path: string) {
    this.router.navigate([path]);
  }
}
