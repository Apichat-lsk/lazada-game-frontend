import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../constant/api-url';
import { Observable } from 'rxjs';
import { AuthTokenService } from '../component/auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient, private auth: AuthTokenService) {}

  checkGameDate(data: any): Observable<any> {
    return this.http.post(
      API.CHECK_GAME_DATE,
      data,
      this.auth.setAuthorization()
    );
  }
}
