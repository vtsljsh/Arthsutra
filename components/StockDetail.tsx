
import React, { useState, useEffect } from 'react';
import type { Stock, SentimentResult, NewsArticle } from '../types';
import { getStockSentiment, getNewsForStock } from '../services/geminiService';
import { getHistoricalData } from '../services/marketDataService';
import GlassCard from './GlassCard';
import HistoricalChart from './HistoricalChart';
import SentimentGauge from './SentimentGauge';
import NewsSection from './NewsSection';

interface StockDetailProps {
    stock: Stock;
    onBack: () => void;
}

const StockDetail: React.FC<StockDetailProps> = ({ stock, onBack }) => {
    const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [historicalData, setHistoricalData] = useState<{ time: string; value: number }[]>([]);
    const [timeRange, setTimeRange] = useState<'1Y' | '5Y'>('1Y');

    const [isLoading, setIsLoading] = useState(true);
    const [sentimentError, setSentimentError] = useState<string | null>(null);
    const [newsError, setNewsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            
            const days = timeRange === '1Y' ? 365 : 365 * 5;
            setHistoricalData(getHistoricalData(stock.ticker, days));

            const [sentimentRes, newsRes] = await Promise.all([
                getStockSentiment(stock),
                getNewsForStock(stock)
            ]);

            if (typeof sentimentRes === 'string') {
                setSentimentError(sentimentRes);
            } else {
                setSentimentResult(sentimentRes);
            }

            if (typeof newsRes === 'string') {
                setNewsError(newsRes);
            } else {
                setNews(newsRes);
            }

            setIsLoading(false);
        };
        fetchAllData();
    }, [stock, timeRange]);
    
    return (
        <GlassCard className="p-4 sm:p-6">
            <button onClick={onBack} className="mb-4 text-electric-mint hover:underline text-sm">&larr; Back to Dashboard</button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-readex text-white">{stock.name} ({stock.ticker})</h2>
                    <p className="text-sm text-gray-400">{stock.sector} Sector</p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                    <p className={`text-3xl sm:text-4xl font-bold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₹{stock.ltp.toFixed(2)}
                    </p>
                    <p className={`font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Main Content: Chart */}
                <div className="lg:col-span-2 bg-deep-indigo/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-electric-mint font-semibold">Historical Performance</h3>
                        <div className="flex space-x-1 bg-gray-700/50 p-1 rounded-lg">
                            <button onClick={() => setTimeRange('1Y')} className={`px-3 py-1 text-xs font-bold rounded-md ${timeRange === '1Y' ? 'bg-electric-mint text-deep-indigo' : 'text-gray-300'}`}>1Y</button>
                            <button onClick={() => setTimeRange('5Y')} className={`px-3 py-1 text-xs font-bold rounded-md ${timeRange === '5Y' ? 'bg-electric-mint text-deep-indigo' : 'text-gray-300'}`}>5Y</button>
                        </div>
                    </div>
                    <HistoricalChart data={historicalData} />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-deep-indigo/50 p-4 rounded-lg h-48 flex flex-col">
                        <h3 className="text-electric-mint font-semibold mb-2">Real-Time Sentiment</h3>
                        {isLoading ? <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">Analyzing...</div> 
                          : sentimentError ? <div className="flex-grow flex items-center justify-center text-red-400 text-sm">{sentimentError}</div> 
                          : sentimentResult && <SentimentGauge score={sentimentResult.score} />}
                    </div>
                    
                    <NewsSection articles={news} isLoading={isLoading} error={newsError} />
                </div>
            </div>
        </GlassCard>
    );
};

export default StockDetail;
