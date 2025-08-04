import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../constant/api-url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  constructor(private http: HttpClient) {}

  recaptcha(data: any): Observable<any> {
    return this.http.post(API.RECAPTCHA, data);
  }
}
