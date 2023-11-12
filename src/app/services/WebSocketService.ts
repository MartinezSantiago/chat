// web-socket.service.ts
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socketUrl = 'ws://localhost:5555';
  private socket!: WebSocket;

  // Initialize messages$ as a BehaviorSubject to ensure that new subscribers receive the last emitted value
  private messagesSubject: Observer<any> | null = null;
  messages$: Observable<any>;

  constructor(private http: HttpClient) {
    this.messages$ = new Observable((observer: Observer<any>) => {
      this.messagesSubject = observer;
    });
  }

  connect(username: string, token: string): void {
    const fullUrl = `${this.socketUrl}?user=${username}&token=${token}`;
    this.socket = new WebSocket(fullUrl);

    this.socket.onopen = (event) => {
      console.log(`WebSocket connection opened for ${username}:`, event);
    };

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      if (this.messagesSubject) {
        this.messagesSubject.next(event.data);
      }
    };

    this.socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket connection closed cleanly for ${username}:`, event);
      } else {
        console.error(`WebSocket connection abruptly closed for ${username}:`, event);
      }
      if (this.messagesSubject) {
        this.messagesSubject.complete();
      }
    };

    this.socket.onerror = (error) => {
      console.error(`WebSocket encountered an error for ${username}:`, error);
      if (this.messagesSubject) {
        this.messagesSubject.error(error);
      }
    };
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket not in OPEN state. Unable to send message.');
    }
  }
}
