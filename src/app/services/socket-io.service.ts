import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProgressMessage {
  step: number;
  status: 'PROCESSING' | 'SUCCESS' | 'ERROR';
  totalRows?: number;
  processedRows?: number;
  validRows?: number;
  errorRows?: number;
  downloadUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
  private socket: Socket | null = null;
  private messageSubject = new Subject<ProgressMessage>();

  connect(password: string | null) {
    if (this.socket) {
      this.disconnect();
    }

    // Pass password or token via auth or query if the server requires it
    this.socket = io(environment.socketHost, {
      auth: {
        token: password
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    this.socket.on('progress', (data: ProgressMessage) => {
      this.messageSubject.next(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });
  }

  getMessages(): Observable<ProgressMessage> {
    return this.messageSubject.asObservable();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
