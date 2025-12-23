
import type { Stock, Sector, FiiDiiData, PreMarketData, SectorName } from '../types';

const sectors: SectorName[] = ['Green Energy', 'Tech', 'PSU', 'Infra', 'Banking', 'FMCG'];
const stockNames: { [key: string]: string } = {
    'RELIANCE': 'Reliance Industries Ltd.', 'TCS': 'Tata Consultancy Services', 'HDFCBANK': 'HDFC Bank Ltd.', 'INFY': 'Infosys Ltd.',
    'ICICIBANK': 'ICICI Bank Ltd.', 'HINDUNILVR': 'Hindustan Unilever Ltd.', 'SBIN': 'State Bank of India', 'BAJFINANCE': 'Bajaj Finance Ltd.',
    'BHARTIARTL': 'Bharti Airtel Ltd.', 'KOTAKBANK': 'Kotak Mahindra Bank Ltd.', 'ADANIENT': 'Adani Enterprises Ltd.', 'ITC': 'ITC Ltd.',
    'LT': 'Larsen & Toubro Ltd.', 'ASIANPAINT': 'Asian Paints Ltd.', 'HCLTECH': 'HCL Technologies Ltd.', 'AXISBANK': 'Axis Bank Ltd.',
    'MARUTI': 'Maruti Suzuki India Ltd.', 'SUNPHARMA': 'Sun Pharmaceutical Industries Ltd.', 'TITAN': 'Titan Company Ltd.', 'WIPRO': 'Wipro Ltd.',
    'ULTRACEMCO': 'UltraTech Cement Ltd.', 'ADANIGREEN': 'Adani Green Energy Ltd.', 'NESTLEIND': 'Nestle India Ltd.', 'GRASIM': 'Grasim Industries Ltd.',
    'JSWSTEEL': 'JSW Steel Ltd.', 'POWERGRID': 'Power Grid Corporation of India Ltd.', 'NTPC': 'NTPC Ltd.', 'ONGC': 'Oil & Natural Gas Corporation Ltd.',
    'TATAMOTORS': 'Tata Motors Ltd.', 'TATASTEEL': 'Tata Steel Ltd.', 'COALINDIA': 'Coal India Ltd.', 'INDUSINDBK': 'IndusInd Bank Ltd.',
    'HINDALCO': 'Hindalco Industries Ltd.', 'BRITANNIA': 'Britannia Industries Ltd.', 'CIPLA': 'Cipla Ltd.', 'DRREDDY': 'Dr. Reddy\'s Laboratories Ltd.',
    'EICHERMOT': 'Eicher Motors Ltd.', 'HEROMOTOCO': 'Hero MotoCorp Ltd.', 'BAJAJ-AUTO': 'Bajaj Auto Ltd.', 'M&M': 'Mahindra & Mahindra Ltd.',
    'TECHM': 'Tech Mahindra Ltd.', 'BPCL': 'Bharat Petroleum Corporation Ltd.', 'IOC': 'Indian Oil Corporation Ltd.', 'SHREECEM': 'Shree Cement Ltd.',
    'UPL': 'UPL Ltd.', 'DIVISLAB': 'Divi\'s Laboratories Ltd.', 'APOLLOHOSP': 'Apollo Hospitals Enterprise Ltd.', 'BAJAJFINSV': 'Bajaj Finserv Ltd.'
};

const stockSectors: { [key: string]: SectorName } = {
    'RELIANCE': 'Infra', 'TCS': 'Tech', 'HDFCBANK': 'Banking', 'INFY': 'Tech', 'ICICIBANK': 'Banking',
    'HINDUNILVR': 'FMCG', 'SBIN': 'PSU', 'BAJFINANCE': 'Banking', 'BHARTIARTL': 'Infra', 'KOTAKBANK': 'Banking',
    'ADANIENT': 'Infra', 'ITC': 'FMCG', 'LT': 'Infra', 'ASIANPAINT': 'FMCG', 'HCLTECH': 'Tech', 'AXISBANK': 'Banking',
    'MARUTI': 'Infra', 'SUNPHARMA': 'Green Energy', 'TITAN': 'FMCG', 'WIPRO': 'Tech', 'ULTRACEMCO': 'Infra',
    'ADANIGREEN': 'Green Energy', 'NESTLEIND': 'FMCG', 'GRASIM': 'Infra', 'JSWSTEEL': 'Infra', 'POWERGRID': 'PSU',
    'NTPC': 'PSU', 'ONGC': 'PSU', 'TATAMOTORS': 'Infra', 'TATASTEEL': 'Infra', 'COALINDIA': 'PSU',
    'INDUSINDBK': 'Banking', 'HINDALCO': 'Infra', 'BRITANNIA': 'FMCG', 'CIPLA': 'Green Energy', 'DRREDDY': 'Green Energy',
    'EICHERMOT': 'Infra', 'HEROMOTOCO': 'Infra', 'BAJAJ-AUTO': 'Infra', 'M&M': 'Infra', 'TECHM': 'Tech',
    'BPCL': 'PSU', 'IOC': 'PSU', 'SHREECEM': 'Infra', 'UPL': 'Green Energy', 'DIVISLAB': 'Green Energy',
    'APOLLOHOSP': 'Green Energy', 'BAJAJFINSV': 'Banking'
};

const nifty50Tickers = Object.keys(stockNames);

const generateRandomStock = (ticker: string): Stock => {
    const ltp = Math.random() * 3000 + 500;
    const changePercent = (Math.random() - 0.5) * 5;
    const change = (ltp * changePercent) / 100;
    return {
        ticker,
        name: stockNames[ticker],
        ltp: parseFloat(ltp.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 100000,
        marketCap: Math.floor(Math.random() * 20) + 1, // in Lakh Crores
        peRatio: parseFloat((Math.random() * 50 + 15).toFixed(2)),
        industryPeRatio: parseFloat((Math.random() * 40 + 20).toFixed(2)),
        sector: stockSectors[ticker] || 'Tech',
    };
};

export const getPulseMapData = (): Stock[] => nifty50Tickers.map(generateRandomStock);

export const getSectoralData = (): Sector[] => {
    return sectors.map(name => ({
        name,
        changePercent: parseFloat(((Math.random() - 0.4) * 3).toFixed(2)),
    })).sort((a, b) => b.changePercent - a.changePercent);
};

export const getFiiDiiData = (): FiiDiiData => ({
    date: new Date().toISOString().split('T')[0],
    fiiBuy: Math.floor(Math.random() * 5000) + 4000,
    fiiSell: Math.floor(Math.random() * 5000) + 4000,
    diiBuy: Math.floor(Math.random() * 4000) + 3000,
    diiSell: Math.floor(Math.random() * 4000) + 3000,
});

export const getPreMarketData = (): PreMarketData[] => [
    {
        index: 'NIFTY 50',
        prediction: 'Gap up opening expected (150-200 pts).',
        sentiment: 'Bullish',
        factors: ['Positive global cues', 'Strong FII inflows'],
    },
    {
        index: 'SENSEX',
        prediction: 'Likely to open in green, tracking global markets.',
        sentiment: 'Bullish',
        factors: ['US market rally', 'IT sector outlook'],
    },
];

export const searchStocks = (query: string): Stock[] => {
    if (!query) return [];
    const upperQuery = query.toUpperCase();
    return nifty50Tickers
        .filter(ticker => ticker.includes(upperQuery) || stockNames[ticker].toUpperCase().includes(upperQuery))
        .slice(0, 5)
        .map(generateRandomStock);
};
