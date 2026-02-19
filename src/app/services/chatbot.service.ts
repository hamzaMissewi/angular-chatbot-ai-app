import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private apiKey = environment.geminiApiKey;

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<string> {
    console.log('Chatbot service sending message:', message);

    // If no API key, use fallback responses immediately
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.log('No API key found, using fallback response');
      return of(this.getFallbackResponse(message));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [{
        parts: [{
          text: message
        }]
      }]
    };

    const url = `${this.geminiApiUrl}?key=${this.apiKey}`;

    return this.http.post<any>(url, body, { headers }).pipe(
      catchError(error => {
        console.error('Gemini API error:', error);
        // Fallback to a simple response if API fails
        return of(this.getFallbackResponse(message));
      })
    );
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Crypto-specific responses
    if (lowerMessage.includes('bitcoin') || lowerMessage.includes('btc')) {
      return "Bitcoin (BTC) is currently showing strong momentum. Based on recent trends, many analysts are optimistic about its short-term prospects. Always do your own research before investing!";
    }

    if (lowerMessage.includes('ethereum') || lowerMessage.includes('eth')) {
      return "Ethereum (ETH) continues to be a leader in DeFi and smart contracts. The network's recent upgrades have improved scalability and reduced gas fees.";
    }

    if (lowerMessage.includes('trade') || lowerMessage.includes('trading')) {
      return "Trading requires careful analysis and risk management. I recommend starting with small positions, using stop-losses, and never investing more than you can afford to lose. Would you like specific trading strategies?";
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Cryptocurrency prices are highly volatile. I can help you track real-time prices and set up price alerts. Which cryptocurrency are you interested in?";
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I'm your CryptoAI assistant! I can help you with:\n• Real-time price tracking\n• Trading strategies\n• Market analysis\n• Portfolio management\n• Risk assessment\n\nWhat would you like to know more about?";
    }

    // General responses
    const responses = [
      "That's an interesting question about cryptocurrency! Based on current market trends, I'd recommend doing thorough research before making any investment decisions.",
      "The crypto market is quite dynamic right now. Remember to diversify your portfolio and only invest what you can afford to lose.",
      "I'm here to help with your crypto journey! Whether you're interested in trading, analysis, or portfolio management, I'm ready to assist.",
      "Cryptocurrency investments carry both opportunities and risks. Make sure to understand the technology behind each project before investing.",
      "Thanks for your message! The crypto space is evolving rapidly - stay informed about regulatory changes and technological developments."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}
