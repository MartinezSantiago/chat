// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../services/WebSocketService';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  username: string = '';
  token: string = '';
  newMessage: string = '';
  messages: any[] = [];

  constructor(
    private websocketService: WebSocketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the user and token from the URL
    this.route.queryParams.subscribe(params => {
      this.username = params['user'];
      this.token = params['token'];

      // Connect to WebSocket with the username and token
      this.websocketService.connect(this.username, this.token);

      // Subscribe to incoming messages
      this.websocketService.messages$.subscribe((message: any) => {
        console.log('Received message in component:', message);
        this.displayMessage(message);
      });
    });
  }

  sendMessage() {
    // Send the message without including user and token
    const formattedMessage = this.newMessage;
    this.websocketService.sendMessage(formattedMessage);
    this.newMessage = '';
  }

  displayMessage(message: any) {
    this.messages.push({ text: message });
  }
  
  getCurrentTime(): string {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Add the updateConnection method
  updateConnection() {
    // Call connect method again with updated username and token
    this.websocketService.connect(this.username, this.token);
  }
}
