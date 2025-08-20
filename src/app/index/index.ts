import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AuthTokenService } from '../../component/auth-token.service';

@Component({
  selector: 'app-index',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {
  constructor(
    private router: Router,
    private location: Location,
    private authTokenService: AuthTokenService
  ) {
    this.location.replaceState('');
  }

  currentDate = new Date();
  gameEndDate = new Date(new Date().setDate(30));

  ngOnInit(): void {
    const token = this.authTokenService.getToken();
    if (!token || !this.isTokenValid(token)) {
      this.router.navigate(['/index']);
    } else {
      if (this.currentDate >= this.gameEndDate) {
        this.router.navigate(['/thankyou']);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  isTokenValid(token: string | null): boolean {
    if (!token) return false;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      return now < exp;
    } catch {
      return false;
    }
  }
  Direct(path: string) {
    this.router.navigate([path]);
  }
}
