import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeedbackService {

  private apiUrl = 'http://localhost:5000/api/feedback';

  constructor(private http: HttpClient) {}

  getEligibleEnrollments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/eligible`);
  }

  submitFeedback(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMyFeedback(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-feedback`);
  }

  getAllFeedback(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }
}