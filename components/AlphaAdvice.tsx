
import React, { useState, useCallback } from 'react';
import { getAlphaAdvice } from '../services/geminiService';
import { getPulseMapData, getSectoralData } from '../services/marketDataService';
import type { AlphaAdvice as AlphaAdviceType } from '../types';
import GlassCard from './GlassCard';

const AlphaAdvice: React.FC = () => {
    const [advice, setAdvice] = useState<AlphaAdviceType | string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateAdvice = useCallback(async () => {
        setIsLoading(true);
        setAdvice(null);
        try {
            const allStocks = getPulseMapData().sort((a,b) => b.changePercent - a.changePercent);
            const topGainers = allStocks.slice(0, 5);
            const topLosers = allStocks.slice(-5).reverse();
            const sectors = getSectoralData();
            
            const result = await getAlphaAdvice(topGainers, topLosers, sectors);
            setAdvice(result);
        } catch (error) {
            setAdvice("An unexpected error occurred while generating advice.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const AdviceCard: React.FC<{title: string, data: any}> = ({title, data}) => (
        <div className="bg-deep-indigo/50 p-4 rounded-lg">
            <h4 className="font-bold text-electric-mint">{title}</h4>
            <p className="text-lg font-semibold mt-1">{data.stock}</p>
            <p className="text-sm text-gray-300 mt-2">{data.reason}</p>
            <p className="text-xs text-gray-400 mt-2">{data.riskReward || data.timeframe}</p>
        </div>
    );

    return (
        <GlassCard className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-readex text-electric-mint">The 'Alpha' Advice</h2>
                <button
                    onClick={handleGenerateAdvice}
                    disabled={isLoading}
                    className="px-4 py-2 bg-electric-mint text-deep-indigo font-bold rounded-lg hover:bg-mint-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Analyzing...' : 'Generate AI Advice'}
                </button>
            </div>
            {isLoading && <div className="text-center p-8">Connecting to Arthasutra AI...</div>}
            
            {advice && typeof advice === 'object' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AdviceCard title="Intraday (1-2 RR)" data={advice.intraday} />
                    <AdviceCard title="Mid-term (1-3 Mo)" data={advice.midTerm} />
                    <AdviceCard title="Long-term (1-5 Yr)" data={advice.longTerm} />
                </div>
            )}
            
            {advice && typeof advice === 'string' && (
                <div className="text-center p-8 bg-red-900/50 rounded-lg">
                    <p className="font-semibold text-red-300">{advice}</p>
                </div>
            )}

            {!advice && !isLoading && (
                 <div className="text-center p-8 text-gray-400">Click "Generate AI Advice" for data-driven insights.</div>
            )}
        </GlassCard>
    );
};

export default AlphaAdvice;
