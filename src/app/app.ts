import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

interface CryptoStat {
  name: string;
  symbol: string;
  price: number;
  change: number;
  icon: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-ai-chatbot-mcp');
  protected isMenuOpen = signal(false);

  protected cryptoStats = signal<CryptoStat[]>([
    { name: 'Bitcoin', symbol: 'BTC', price: 45234.56, change: 2.34, icon: '₿' },
    { name: 'Ethereum', symbol: 'ETH', price: 2845.23, change: -1.23, icon: 'Ξ' },
    { name: 'Cardano', symbol: 'ADA', price: 0.456, change: 5.67, icon: '₳' },
    { name: 'Solana', symbol: 'SOL', price: 123.45, change: 3.21, icon: '◎' }
  ]);

  protected features = signal<Feature[]>([
    {
      icon: '🤖',
      title: 'AI Trading Bot',
      description: 'Advanced machine learning algorithms for automated trading strategies with real-time market analysis.'
    },
    {
      icon: '📈',
      title: 'Real-time Analytics',
      description: 'Comprehensive market data and analytics with advanced charting tools and technical indicators.'
    },
    {
      icon: '🔒',
      title: 'Secure Trading',
      description: 'Bank-grade security with multi-signature wallets, cold storage, and advanced encryption protocols.'
    },
    {
      icon: '📊',
      title: 'Portfolio Management',
      description: 'Track and manage your cryptocurrency portfolio with detailed performance metrics and insights.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Execute trades in milliseconds with our low-latency infrastructure and optimized trading engine.'
    },
    {
      icon: '🌍',
      title: 'Global Markets',
      description: 'Access to cryptocurrency markets worldwide with 24/7 trading and multi-currency support.'
    }
  ]);

  protected toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  protected startTrading() {
    console.log('Starting trading...');
    // Navigate to trading page or open trading modal
  }

  protected viewDemo() {
    console.log('Viewing demo...');
    // Navigate to demo page or open demo modal
  }
}
