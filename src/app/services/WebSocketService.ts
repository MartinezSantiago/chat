// web-socket.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;

  connect(username: string): Observable<any> {
    const socketUrl = `ws://localhost:5555?username=${username}`;
    this.socket = new WebSocket(socketUrl);

    return new Observable(observer => {
      this.socket.onopen = (event) => {
        console.log(`WebSocket connection opened for ${username}:`, event);
      };

      this.socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
        observer.next(event.data);
      };

      this.socket.onclose = (event) => {
        if (event.wasClean) {
          console.log(`WebSocket connection closed cleanly for ${username}:`, event);
        } else {
          console.error(`WebSocket connection abruptly closed for ${username}:`, event);
        }
        observer.complete();
      };

      this.socket.onerror = (error) => {
        console.error(`WebSocket encountered an error for ${username}:`, error);
      };

      return () => {
        // Cleanup on unsubscribe
        this.socket.close();
      };
    });
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket not in OPEN state. Unable to send message.');
    }
  }
}
