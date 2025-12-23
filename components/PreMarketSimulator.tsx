
import React, { useState, useEffect } from 'react';
import { getPreMarketData } from '../services/marketDataService';
import type { PreMarketData } from '../types';
import GlassCard from './GlassCard';

const PreMarketSimulator: React.FC = () => {
    const [data, setData] = useState<PreMarketData[]>([]);

    useEffect(() => {
        setData(getPreMarketData());
    }, []);

    const sentimentColor = (sentiment: PreMarketData['sentiment']) => {
        switch (sentiment) {
            case 'Bullish': return 'text-green-400';
            case 'Bearish': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };
    
    return (
        <GlassCard className="p-4">
            <h2 className="text-xl font-bold font-readex text-electric-mint mb-4">Pre-Market Simulator</h2>
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.index}>
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-white">{item.index}</h3>
                            <p className={`font-semibold ${sentimentColor(item.sentiment)}`}>{item.sentiment}</p>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{item.prediction}</p>
                        <p className="text-xs text-gray-400 mt-1">Factors: {item.factors.join(', ')}</p>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

export default PreMarketSimulator;
