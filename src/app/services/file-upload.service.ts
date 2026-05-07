import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private http = inject(HttpClient);
  // Mock API URL for now
  private apiUrl = '/api/v1/tax/upload';

  constructor() { }

  /**
   * Upload an excel file to the server and track progress
   * @param file The file to upload
   * @returns Observable of HttpEvent to track progress
   */
  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    // Using reportProgress: true and observe: 'events' as required
    return this.http.post<any>(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
