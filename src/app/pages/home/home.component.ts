import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PasswordService } from '../../services/password.service';
import { ToolListComponent } from '../../components/tool-list/tool-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToolListComponent],
  template: `
    <div class="min-h-screen bg-slate-900 flex flex-col items-center py-12 relative overflow-hidden">
      
      <!-- Background Decorations -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
        <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <!-- Header -->
      <div class="w-full max-w-4xl px-4 z-10 mb-12 text-left">
        <h1 class="text-4xl md:text-5xl font-extrabold italic bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-md tracking-wider">
          AT Tools
        </h1>
      </div>

      <!-- Main Content -->
      <div class="w-full max-w-4xl px-4 z-10 flex flex-col gap-8 md:px-12 items-center">
        
        <!-- Password Card -->
        <div class="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 w-full max-w-md mx-auto backdrop-blur-sm bg-opacity-90">
          <h2 class="text-2xl font-bold text-center text-slate-100 mb-6">Nhập Mật Khẩu Truy cập</h2>
          
          <div class="relative mb-6">
            <input 
              [type]="showPassword ? 'text' : 'password'" 
              [(ngModel)]="password"
              placeholder="Nhập mật khẩu..." 
              class="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              (keyup.enter)="savePassword()"
            >
            <button 
              type="button" 
              (click)="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
              <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
          
          <button 
            (click)="savePassword()"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
          >
            Lưu mật khẩu
          </button>
          
          <div *ngIf="savedMessage" class="mt-4 text-center text-sm text-green-400 animate-pulse">
            {{ savedMessage }}
          </div>
        </div>

        <!-- Tool List Card -->
        <div class="w-full max-w-md mx-auto h-[400px]">
          <app-tool-list></app-tool-list>
        </div>

      </div>
    </div>
  `
})
export class HomeComponent {
  private passwordService = inject(PasswordService);
  
  password = '';
  showPassword = false;
  savedMessage = '';

  constructor() {
    this.password = this.passwordService.getPassword() || '';
  }

  savePassword() {
    if (this.password.trim()) {
      this.passwordService.setPassword(this.password);
      this.savedMessage = 'Đã lưu mật khẩu!';
      setTimeout(() => this.savedMessage = '', 3000);
    }
  }
}
