import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    result: string;
  };
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: ChatMessage[] = [
    {
      text: 'สวัสดีครับ! ผมพร้อมที่จะช่วยเหลือคุณแล้ว',
      isUser: false,
      timestamp: new Date()
    }
  ];
  
  currentMessage: string = '';
  isLoading: boolean = false;
  
  private apiUrl = 'https://localhost:7191/ExampleTwo';

  constructor(private http: HttpClient) {}

  async sendMessage() {
    if (!this.currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    this.messages.push(userMessage);
    
    const messageToSend = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    try {
      const response = await this.http.post<ApiResponse>(this.apiUrl, {
        dataInput: messageToSend
      }).toPromise();

      if (response && response.status) {
        const botMessage: ChatMessage = {
          text: response.data.result,
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(botMessage);
      } else {
        const errorMessage: ChatMessage = {
          text: 'ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล',
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(errorMessage);
      }
    } catch (error) {
      console.error('API Error:', error);
      
      const errorMessage: ChatMessage = {
        text: 'ขออภัยครับ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง',
        isUser: false,
        timestamp: new Date()
      };
      this.messages.push(errorMessage);
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }
}