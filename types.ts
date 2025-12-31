
export type SummaryLength = 'short' | 'medium' | 'detailed';
export type Language = 'en' | 'id' | 'ja';

export interface SummaryResult {
  summary: string;
  bulletPoints: string[];
  keyTakeaways: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MarketplacePrice {
  name: string;
  priceIDR?: string;
  priceUSD?: string;
  link: string;
  format: 'Physical' | 'Digital' | 'Both';
  isInternational: boolean;
}

export interface AnimeContinuationResult {
  animeTitle: string;
  nextChapter: string;
  nextVolume: string;
  synopsis: string;
  volumeImageUrl: string;
  marketplaces: MarketplacePrice[];
}

export enum TabType {
  SUMMARIZER = 'summarizer',
  ANIME_FINDER = 'anime_finder',
  TRANSLATOR = 'translator'
}
