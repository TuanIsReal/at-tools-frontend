import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PasswordService } from './password.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private http = inject(HttpClient);
  private passwordService = inject(PasswordService);
  private apiUrl = `${environment.apiHost}/attools/api/v1/check-tax-number/upload`;

  constructor() { }

  /**
   * Upload an excel file to the server
   * @param file The file to upload
   * @returns Observable of HttpEvent to track progress and response
   */
  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const password = this.passwordService.getPassword();
    if (password) {
      formData.append('password', password);
    }

    return this.http.post<any>(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
