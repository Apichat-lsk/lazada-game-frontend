import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../constant/api-url';
import { Observable } from 'rxjs';
import { AuthTokenService } from '../component/auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(private http: HttpClient, private auth: AuthTokenService) {}

  findAllQuestions(data: any): Observable<any> {
    return this.http.post(API.QUESTIONS, data, this.auth.setAuthorization());
  }
  answer(data: any): Observable<any> {
    return this.http.post(API.ANSWER, data, this.auth.setAuthorization());
  }
  checkAnswer(data: any): Observable<any> {
    return this.http.post(API.CHECK_ANSWER, data, this.auth.setAuthorization());
  }
}
