import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {

  private apiUrl = 'https://training-management-system-8s6q.onrender.com/api/enrollments';

  constructor(private http: HttpClient) {}

  // Employee
  getAvailableBatches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-batches`);
  }

  requestEnrollment(batchId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, { batchId });
  }

  getMyEnrollments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-enrollments`);
  }

  // Manager
  getPendingRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending`);
  }

  getManagerRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/manager-requests`);
  }

  approveEnrollment(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectEnrollment(id: string, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, { reason });
  }

  // Admin
  getAllEnrollments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  enrollParticipant(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/enroll`, {});
  }
}
