import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../constant/api-url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(API.REGISTER, data);
  }
  checkDuplicate(data: any): Observable<any> {
    return this.http.post(API.CHECK_DUPLICATE, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(API.LOGIN, data);
  }
  changePassword(data: any): Observable<any> {
    return this.http.post(API.CHANGE_PASSWORD, data);
  }
}
