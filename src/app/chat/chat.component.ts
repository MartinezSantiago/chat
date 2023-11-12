// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/WebSocketService';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  username: string = '';
  newMessage: string = '';
  messages: any[] = [];

  constructor(private websocketService: WebSocketService) {}

  ngOnInit() {
    // Connect to WebSocket on component initialization
    this.websocketService.connect(this.username)
      .subscribe((message:any) => {
        console.log('Received message in component:', message);
        this.displayMessage(message);
      });
  }

  sendMessage() {
    const formattedMessage = `${this.username}: ${this.newMessage}`;
    this.websocketService.sendMessage(formattedMessage);
    this.newMessage = '';
  }

  displayMessage(message:any) {
    this.messages.push({ text: message });
  }
  
  getCurrentTime(): string {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
