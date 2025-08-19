import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../constant/api-url';
import { Observable } from 'rxjs';
import { AuthTokenService } from '../component/auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient, private auth: AuthTokenService) {}

  create(data: any): Observable<any> {
    return this.http.post(API.CONTACT, data);
  }
}
