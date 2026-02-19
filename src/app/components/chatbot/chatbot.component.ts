import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages = signal<{ role: string; content: string }[]>([]);
  isLoading = signal(false);
  userInput = signal('');
  isOpen = signal(false);

  constructor(private chatbotService: ChatbotService) { }

  toggleChat() {
    this.isOpen.set(!this.isOpen());
  }

  sendMessage() {
    const message = this.userInput().trim();
    if (!message) return;

    this.messages.update(msgs => [...msgs, { role: 'user', content: message }]);
    this.userInput.set('');
    this.isLoading.set(true);

    this.chatbotService.sendMessage(message).subscribe({
      next: (response: any) => {
        const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text || response || 'I received your message but I am having trouble processing it right now.';
        this.messages.update(msgs => [...msgs, { role: 'assistant', content: responseText }]);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.messages.update(msgs => [...msgs, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        this.isLoading.set(false);
      }
    });
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
