import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BatchService {

  private apiUrl = 'http://localhost:5000/api/batches';

  constructor(private http: HttpClient) {}

  getBatches(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getBatch(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createBatch(batch: any): Observable<any> {
    return this.http.post(this.apiUrl, batch);
  }

  updateBatch(id: string, batch: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, batch);
  }

  deleteBatch(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}