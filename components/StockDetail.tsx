
import React, { useState, useEffect } from 'react';
import type { Stock, SentimentResult } from '../types';
import { getStockSentiment } from '../services/geminiService';
import GlassCard from './GlassCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StockDetailProps {
    stock: Stock;
    onBack: () => void;
}

const StockDetail: React.FC<StockDetailProps> = ({ stock, onBack }) => {
    const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);
    const [isLoadingSentiment, setIsLoadingSentiment] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSentiment = async () => {
            setIsLoadingSentiment(true);
            setError(null);
            const result = await getStockSentiment(stock);
            if (typeof result === 'string') {
                setError(result);
            } else {
                setSentimentResult(result);
            }
            setIsLoadingSentiment(false);
        };
        fetchSentiment();
    }, [stock]);

    const peData = [
        { name: stock.ticker, value: stock.peRatio, color: '#6ee7b7' },
        { name: 'Industry Avg.', value: stock.industryPeRatio, color: '#4b5563' },
    ];

    const renderSentiment = () => {
        if (isLoadingSentiment) return <p className="text-gray-400">Analyzing real-time sentiment...</p>;
        if (error) return <p className="text-red-400">{error}</p>;
        if (!sentimentResult) return <p className="text-gray-400">No sentiment data available.</p>;

        return (
            <div>
                <p className="text-gray-300">{sentimentResult.sentiment}</p>
                {sentimentResult.sources && sentimentResult.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-glass-border">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Sources</h4>
                        <ul className="space-y-1">
                            {sentimentResult.sources.map((source, index) => (
                                <li key={index} className="truncate">
                                    <a
                                        href={source.web.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-400 hover:text-electric-mint hover:underline transition-colors"
                                    >
                                        {source.web.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <GlassCard className="p-6">
            <button onClick={onBack} className="mb-4 text-electric-mint hover:underline">&larr; Back to Dashboard</button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                    <h2 className="text-3xl font-bold font-readex text-white">{stock.name} ({stock.ticker})</h2>
                </div>
                <div className="text-right mt-4 md:mt-0">
                    <p className={`text-4xl font-bold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₹{stock.ltp.toFixed(2)}
                    </p>
                    <p className={`font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-deep-indigo/50 p-4 rounded-lg col-span-1 md:col-span-2">
                    <h3 className="text-electric-mint font-semibold mb-2">Real-Time Sentiment</h3>
                    {renderSentiment()}
                </div>
                <div className="bg-deep-indigo/50 p-4 rounded-lg">
                    <h3 className="text-electric-mint font-semibold mb-2">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-400">Market Cap:</p><p className="font-semibold">₹{stock.marketCap} L Cr</p>
                        <p className="text-gray-400">Volume:</p><p className="font-semibold">{stock.volume.toLocaleString('en-IN')}</p>
                        <p className="text-gray-400">Sector:</p><p className="font-semibold">{stock.sector}</p>
                    </div>
                </div>
                 <div className="bg-deep-indigo/50 p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
                    <h3 className="text-electric-mint font-semibold mb-2">P/E Ratio vs. Industry</h3>
                     <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={peData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#9ca3af" width={80} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4A5568', borderRadius: '0.5rem' }}/>
                                <Bar dataKey="value" barSize={20}>
                                    {peData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default StockDetail;
