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
    const responses = [
      "I'm here to help! Could you please rephrase your question?",
      "That's interesting! Tell me more about what you'd like to know.",
      "I'm processing your request. How else can I assist you today?",
      "Thanks for your message! I'm here to help with any questions you have.",
      "I understand you're asking about something. Could you provide more details?"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}
