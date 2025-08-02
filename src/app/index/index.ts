import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-index',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {
  constructor(private router: Router, private location: Location) {
    this.location.replaceState('');
  }

  Login() {
    this.router.navigate(['/signin']);
  }
  Register() {
    this.router.navigate(['/signup']);
  }
}
