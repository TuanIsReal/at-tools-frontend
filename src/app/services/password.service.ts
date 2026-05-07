import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private readonly SESSION_KEY = 'at_tools_pass';
  
  // Initialize with session storage value if it exists
  private passwordSubject = new BehaviorSubject<string | null>(sessionStorage.getItem(this.SESSION_KEY));
  
  // Observable to subscribe to password changes
  password$ = this.passwordSubject.asObservable();

  constructor() {}

  /**
   * Save password to session storage and update observable
   * @param password The password to save
   */
  setPassword(password: string): void {
    sessionStorage.setItem(this.SESSION_KEY, password);
    this.passwordSubject.next(password);
  }

  /**
   * Get current password value
   * @returns The current password or null
   */
  getPassword(): string | null {
    return this.passwordSubject.getValue();
  }

  /**
   * Clear password from session storage and observable
   */
  clearPassword(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    this.passwordSubject.next(null);
  }
}
