import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthTokenService } from './auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authTokenService: AuthTokenService
  ) {}

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    const payload = token.split('.')[1];
    if (!payload) return true;
    const decoded = JSON.parse(atob(payload));
    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);

    return now >= exp;
  }

  canActivate(): boolean {
    const token = this.authTokenService.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.router.navigate(['/signin']);
      return false;
    }
    return true;
  }
}
