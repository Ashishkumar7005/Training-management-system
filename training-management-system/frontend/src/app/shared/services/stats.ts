import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatsService {

  private apiUrl = 'https://training-management-system-8s6q.onrender.com/api/stats';

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`);
  }

  getManagerStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/manager`);
  }

  getEmployeeStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee`);
  }
}
