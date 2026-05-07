import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 h-full max-h-[80vh] flex flex-col">
      <h2 class="text-xl font-semibold mb-4 text-slate-200 sticky top-0 bg-slate-800 z-10 py-2">Danh sách Tools</h2>
      <div class="overflow-y-auto flex-1 pr-2 space-y-2">
        <!-- Active Tool -->
        <a routerLink="/check-tax-number" routerLinkActive="bg-blue-600/20 text-blue-400 border-blue-500" class="flex items-center p-3 rounded-lg border border-transparent hover:bg-slate-700 transition-colors cursor-pointer group text-slate-300">
          <div class="w-8 h-8 mr-3 flex items-center justify-center bg-green-600/20 text-green-500 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <span class="font-medium group-hover:text-blue-300 transition-colors">Check Tax Number</span>
        </a>

        <!-- Disabled Tools -->
        <div class="flex items-center p-3 rounded-lg border border-transparent opacity-50 cursor-not-allowed text-slate-400">
          <div class="w-8 h-8 mr-3 flex items-center justify-center bg-slate-700 rounded text-slate-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>
          </div>
          <span class="font-medium">File Convert</span>
        </div>

        <div class="flex items-center p-3 rounded-lg border border-transparent opacity-50 cursor-not-allowed text-slate-400">
          <div class="w-8 h-8 mr-3 flex items-center justify-center bg-slate-700 rounded text-slate-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
          </div>
          <span class="font-medium">Data Clean</span>
        </div>
        
        <div class="flex items-center p-3 rounded-lg border border-transparent opacity-50 cursor-not-allowed text-slate-400">
          <div class="w-8 h-8 mr-3 flex items-center justify-center bg-slate-700 rounded text-slate-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>
          </div>
          <span class="font-medium">File Convert</span>
        </div>

        <div class="flex items-center p-3 rounded-lg border border-transparent opacity-50 cursor-not-allowed text-slate-400">
          <div class="w-8 h-8 mr-3 flex items-center justify-center bg-slate-700 rounded text-slate-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
          </div>
          <span class="font-medium">Data Convert</span>
        </div>
      </div>
    </div>
  `
})
export class ToolListComponent {}
