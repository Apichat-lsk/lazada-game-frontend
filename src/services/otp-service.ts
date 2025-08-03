import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../constant/api-url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  constructor(private http: HttpClient) {}

  send(data: any): Observable<any> {
    return this.http.post(API.SEND_OTP, data);
  }
  verify(data: any): Observable<any> {
    return this.http.post(API.VERIFY_OTP, data);
  }
  getOtp(data: any): Observable<any> {
    return this.http.post(API.GET_OTP, data);
  }
  forgotPasswordVerifyOtp(data: any): Observable<any> {
    return this.http.post(API.FORGOT_PASSWORD_VERIFY_OTP, data);
  }
}
