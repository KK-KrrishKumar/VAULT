export interface Company {
  symbol: string;
  name: string;
  marketCap: number; // in Crores
  ltp: number; // Last Traded Price in INR
  chg: number; // Change percentage (positive or negative)
  sector: string;
  description: string;
  logoUrl?: string;
}

export interface FinancialReport {
  id: string;
  symbol: string;
  companyName: string;
  period: string; // e.g. "Q3 FY26"
  netProfit: number; // Net profit in Crores
  ebitdaMargin: number; // EBITDA margin %
  revenue: number; // Revenue in Crores
  publishedAt: string; // Date string
  summary: string; // AI summarized view
}

export interface InsiderTrade {
  id: string;
  symbol: string;
  companyName: string;
  insiderName: string;
  action: 'Promoter Buying' | 'Whales Buying' | 'Merger' | 'Capex' | 'FII/DII activity';
  shares: number;
  valueCr: number; // Value in Crores
  date: string;
}

export interface PressRelease {
  id: string;
  symbol: string;
  companyName: string;
  title: string;
  content: string;
  category: string; // e.g., "Corporate Action", "General Announcement", "Product Launch"
  publishedAt: string;
}

export interface WatchlistItem {
  symbol: string;
  userId: string;
  addedAt: string;
}

export interface WhatsappConfig {
  userId: string;
  phoneNumber: string;
  isEnabled: boolean;
  updatedAt: string;
}

export interface WhatsappLog {
  id: string;
  userId: string;
  symbol: string;
  type: 'results' | 'insider' | 'press_release' | 'system';
  message: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface IndexData {
  name: string;
  chg: number;
  pct: number;
}
