
export interface Stock {
    ticker: string;
    name: string;
    ltp: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    peRatio: number;
    industryPeRatio: number;
    sector: SectorName;
}

export interface Sector {
    name: SectorName;
    changePercent: number;
}

export type SectorName = 'Green Energy' | 'Tech' | 'PSU' | 'Infra' | 'Banking' | 'FMCG';

export interface FiiDiiData {
    date: string;
    fiiBuy: number;
    fiiSell: number;
    diiBuy: number;
    diiSell: number;
}

export interface PreMarketData {
    index: 'NIFTY 50' | 'SENSEX';
    prediction: string;
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
    factors: string[];
}

export interface AlphaAdvice {
    intraday: {
        stock: string;
        reason: string;
        riskReward: string;
    };
    midTerm: {
        stock: string;
        reason: string;
        timeframe: string;
    };
    longTerm: {
        stock: string;
        reason: string;
        timeframe: string;
    };
}

// Types for Google Search Grounding
export interface GroundingSource {
    uri: string;
    title: string;
}

export interface GroundingChunk {
    web: GroundingSource;
}

export interface SentimentResult {
    sentiment: string;
    score: number; // Score from -1 (bearish) to 1 (bullish)
    sources: GroundingChunk[];
}

export interface NewsArticle {
    title: string;
    url: string;
    source: string;
}
