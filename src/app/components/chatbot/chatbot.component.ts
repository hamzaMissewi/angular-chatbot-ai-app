import { Component, signal, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ChatbotService, HttpClient],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewInit {
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messageContainer') messageContainer!: ElementRef<HTMLDivElement>;

  messages = signal<{ role: string; content: string; timestamp?: Date }[]>([]);
  isLoading = signal(false);
  userInput = signal('');
  isOpen = signal(false);

  constructor(private chatbotService: ChatbotService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    // Component is fully initialized
  }

  ngOnInit() {
    // Add welcome message when component initializes
    this.messages.set([{
      role: 'assistant',
      content: 'Hello! I\'m your CryptoAI assistant. How can I help you with cryptocurrency trading today?',
      timestamp: new Date()
    }]);
  }

  toggleChat() {
    console.log('Chatbot toggle clicked, current state:', this.isOpen());
    this.isOpen.set(!this.isOpen());
    console.log('Chatbot new state:', this.isOpen());
  }

  // Public method to allow external calls
  openChat() {
    this.isOpen.set(true);
  }

  closeChat() {
    this.isOpen.set(false);
  }

  showDetails() {
    this.messages.update(msgs => [...msgs, {
      role: 'assistant',
      content: 'Here are some details about this project:\n\n• **Built with:** Angular 21, Signals, and Gemini AI\n• **Developer:** Hamza Missaoui\n• **Core Features:** Real-time crypto analysis, AI-powered trading insights, and responsive design.\n\nHow can I help you further?',
      timestamp: new Date()
    }]);
    this.scrollToBottom();
  }

  sendMessage() {
    const message = this.userInput().trim();
    if (!message || this.isLoading()) return;

    console.log('Sending message:', message);

    // Add user message
    this.messages.update(msgs => [...msgs, {
      role: 'user',
      content: message,
      timestamp: new Date()
    }]);

    this.userInput.set('');
    this.isLoading.set(true);

    // Send to service
    this.chatbotService.sendMessage(message).subscribe({
      next: (response: any) => {
        console.log('API response:', response);
        const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text ||
          response?.response ||
          'I received your message but I am having trouble processing it right now.';

        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: responseText,
          timestamp: new Date()
        }]);
        this.isLoading.set(false);
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Chatbot error:', error);
        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
          timestamp: new Date()
        }]);
        this.isLoading.set(false);
        this.scrollToBottom();
      }
    });
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messageContainer) {
        const container = this.messageContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat() {
    this.messages.set([{
      role: 'assistant',
      content: 'Chat cleared. How can I help you?',
      timestamp: new Date()
    }]);
  }

  formatTime(timestamp?: Date) {
    if (!timestamp) return '';
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
