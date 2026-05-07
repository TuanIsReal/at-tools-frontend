import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PasswordService } from '../../services/password.service';
import { FileUploadService } from '../../services/file-upload.service';
import { ToolListComponent } from '../../components/tool-list/tool-list.component';
import { HttpEventType } from '@angular/common/http';
import { catchError, of, Subscription, tap, delay } from 'rxjs';

@Component({
  selector: 'app-check-tax-number',
  standalone: true,
  imports: [CommonModule, RouterModule, ToolListComponent],
  template: `
    <div class="min-h-screen bg-slate-900 flex flex-col pt-6 px-4 md:px-8 relative overflow-hidden text-slate-200">
      
      <!-- Background Decorations -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
        <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div class="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <!-- Header Layout -->
      <div class="flex justify-between items-center mb-8 z-10 w-full max-w-6xl mx-auto">
        <h1 class="text-4xl font-extrabold italic bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-md tracking-wider cursor-pointer" routerLink="/">
          AT Tools
        </h1>
        <div class="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto z-10 flex-1 pb-10">
        <!-- Sidebar -->
        <div class="w-full md:w-64 flex-shrink-0">
          <app-tool-list></app-tool-list>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
          <h2 class="text-2xl font-bold mb-4 text-slate-100 flex items-center">
            Kiểm tra Mã số thuế 
            <span class="text-slate-400 text-xl font-normal ml-2">(Check Tax Number)</span>
          </h2>

          <div class="bg-slate-800 rounded-xl shadow-xl border border-slate-700 flex-1 flex flex-col overflow-hidden">
            <!-- Password Header -->
            <div class="bg-slate-700/50 p-4 border-b border-slate-700 flex items-center text-sm">
              <div class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <span class="text-slate-300">
                Mật khẩu: <span class="tracking-widest">{{ password ? '****' : 'Chưa có' }}</span> 
                <span class="text-slate-400 ml-1">({{ password ? 'Đã lưu cho phiên này' : 'Chưa lưu' }})</span>
              </span>
              <a routerLink="/" class="ml-2 text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">(Sửa)</a>
            </div>

            <!-- Content Area -->
            <div class="p-6 md:p-10 flex-1 flex flex-col justify-center">
              
              <!-- STATE: UPLOAD -->
              <div *ngIf="state === 'UPLOAD'" class="w-full">
                <div 
                  class="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-slate-700/30 transition-all cursor-pointer group"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop($event)"
                  (click)="fileInput.click()"
                  [class.border-blue-500]="isDragging"
                  [class.bg-slate-700]="isDragging"
                >
                  <input type="file" #fileInput class="hidden" accept=".xlsx" (change)="onFileSelected($event)">
                  <div class="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-blue-900/50 transition-colors">
                    <svg class="text-slate-400 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <h3 class="text-lg font-medium text-slate-200 mb-2">Tải lên danh sách Mã số thuế (XLSX)</h3>
                  <p class="text-slate-400 text-sm">Kéo thả file hoặc nhấn để chọn (Tối đa 20MB)</p>
                </div>
                
                <div class="mt-8 text-center">
                  <button 
                    [disabled]="!selectedFile"
                    (click)="startUpload()"
                    class="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium py-3 px-12 rounded-full shadow-lg transition-all"
                  >
                    Upload Tax Excel
                  </button>
                </div>
              </div>

              <!-- STATE: PROCESSING -->
              <div *ngIf="state === 'PROCESSING'" class="w-full">
                <div class="flex justify-between items-end mb-4">
                  <h3 class="text-2xl font-bold text-slate-100">Đang xử lý file dữ liệu...</h3>
                  <span class="text-slate-400">Đang xử lý ({{ processedRows }}/{{ totalRows }} dòng)...</span>
                </div>
                
                <!-- Progress Bar -->
                <div class="w-full h-4 bg-slate-700 rounded-full overflow-hidden mb-8 flex items-center p-0.5 relative">
                  <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 relative" [style.width.%]="progress">
                    <div class="absolute inset-0 bg-white/20 w-full h-full" style="background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent); background-size: 1rem 1rem; animation: progress-bar-stripes 1s linear infinite;"></div>
                  </div>
                  <span class="absolute text-[10px] font-bold text-white right-2" *ngIf="progress > 5">{{ progress }}%</span>
                </div>

                <!-- Checklist -->
                <div class="space-y-3 mb-8 ml-2">
                  <div class="flex items-center text-slate-300">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center mr-3" [ngClass]="step1 ? 'bg-green-500 text-white' : 'border-2 border-slate-500'">
                      <svg *ngIf="step1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Đọc dữ liệu từ file '{{ selectedFile?.name || "danh_sach_mst.xlsx" }}'</span>
                  </div>
                  <div class="flex items-center text-slate-300">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center mr-3" [ngClass]="step2 ? 'bg-green-500 text-white' : 'border-2 border-slate-500'">
                      <svg *ngIf="step2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Xác thực định dạng Excel</span>
                  </div>
                  <div class="flex items-center text-slate-300">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center mr-3" [ngClass]="step3 ? 'bg-green-500 text-white' : 'border-2 border-slate-500'">
                      <svg *ngIf="step3" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Kiểm tra kết nối API Tổng cục Thuế...</span>
                  </div>
                  <div class="flex items-center text-slate-300">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center mr-3" [ngClass]="step4 ? 'bg-green-500 text-white' : 'border-2 border-slate-500'">
                      <svg *ngIf="step4" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Đang đối chiếu dữ liệu... ({{ progress }}%)</span>
                  </div>
                </div>

                <div class="text-center">
                  <button disabled class="bg-blue-600/50 text-slate-300 cursor-not-allowed font-medium py-3 px-12 rounded-full shadow-lg">
                    Tải xuống (Đang xử lý...)
                  </button>
                </div>
              </div>

              <!-- STATE: SUCCESS -->
              <div *ngIf="state === 'SUCCESS'" class="w-full relative">
                <div class="flex justify-between items-start mb-8">
                  <div class="flex items-center">
                    <div class="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 mr-4 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 class="text-3xl font-bold text-slate-100">Xử lý hoàn tất!</h3>
                  </div>
                  
                  <div class="bg-slate-700/50 rounded-xl p-4 min-w-[200px] border border-slate-600">
                    <div class="text-slate-200 mb-2">Tổng số dòng: <span class="font-bold">{{ totalRows }}</span></div>
                    <div class="text-green-400 mb-1">Hợp lệ: {{ validRows }}</div>
                    <div class="text-red-400">Lỗi: {{ errorRows }}</div>
                  </div>
                </div>

                <!-- Checklist -->
                <div class="space-y-3 mb-10 ml-2">
                  <div class="flex items-center text-slate-300">
                    <div class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Đọc dữ liệu từ file '{{ selectedFile?.name || "danh_sach_mst.xlsx" }}'</span>
                  </div>
                  <div class="flex items-center text-slate-300">
                    <div class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Xác thực định dạng Excel</span>
                  </div>
                  <div class="flex items-center text-slate-300">
                    <div class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Kiểm tra kết nối API Tổng cục Thuế...</span>
                  </div>
                  <div class="flex items-center text-slate-300">
                    <div class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Hoàn tất đối chiếu dữ liệu ({{ totalRows }}/{{ totalRows }} dòng)</span>
                  </div>
                </div>

                <div class="text-center">
                  <button class="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center mx-auto" (click)="download()">
                    <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15l2 2 4-4"></path></svg>
                    Tải xuống file kết quả (XLSX)
                  </button>
                  
                  <button class="mt-4 text-blue-400 hover:text-blue-300 text-sm underline" (click)="reset()">
                    Kiểm tra file khác
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes progress-bar-stripes {
      from  { background-position: 1rem 0; }
      to    { background-position: 0 0; }
    }
  `]
})
export class CheckTaxNumberComponent implements OnInit {
  private passwordService = inject(PasswordService);
  private fileUploadService = inject(FileUploadService);

  password: string | null = null;
  state: 'UPLOAD' | 'PROCESSING' | 'SUCCESS' = 'UPLOAD';
  
  isDragging = false;
  selectedFile: File | null = null;
  
  // Progress mock state
  progress = 0;
  totalRows = 480;
  processedRows = 0;
  validRows = 465;
  errorRows = 15;
  
  step1 = false;
  step2 = false;
  step3 = false;
  step4 = false;

  ngOnInit() {
    this.password = this.passwordService.getPassword();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx')) {
        this.selectedFile = file;
      } else {
        alert('Vui lòng chọn file định dạng .xlsx');
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      this.selectedFile = file;
    }
  }

  startUpload() {
    if (!this.selectedFile) return;
    
    this.state = 'PROCESSING';
    this.resetProgress();
    
    // In a real app, we would subscribe to this.fileUploadService.uploadFile
    // But since there's no backend, we simulate the progress events
    this.simulateProgress();
  }

  simulateProgress() {
    this.step1 = true;
    
    setTimeout(() => {
      this.step2 = true;
    }, 1000);
    
    setTimeout(() => {
      this.step3 = true;
    }, 2000);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 100) {
        currentProgress += 5;
        this.progress = currentProgress;
        this.processedRows = Math.floor((currentProgress / 100) * this.totalRows);
      } else {
        clearInterval(interval);
        this.step4 = true;
        setTimeout(() => {
          this.state = 'SUCCESS';
        }, 500);
      }
    }, 200); // Takes about 4 seconds total
  }

  resetProgress() {
    this.progress = 0;
    this.processedRows = 0;
    this.step1 = false;
    this.step2 = false;
    this.step3 = false;
    this.step4 = false;
  }

  download() {
    alert('Đang tải file...');
  }

  reset() {
    this.state = 'UPLOAD';
    this.selectedFile = null;
    this.resetProgress();
  }
}
