
import React, { useState, useEffect } from 'react';
import { getFiiDiiData } from '../services/marketDataService';
import type { FiiDiiData } from '../types';
import GlassCard from './GlassCard';

const FIIDIITracker: React.FC = () => {
    const [data, setData] = useState<FiiDiiData | null>(null);

    useEffect(() => {
        setData(getFiiDiiData());
    }, []);

    if (!data) return null;

    const fiiNet = data.fiiBuy - data.fiiSell;
    const diiNet = data.diiBuy - data.diiSell;

    const formatCurrency = (value: number) => `₹${Math.abs(value).toLocaleString('en-IN')} Cr`;

    return (
        <GlassCard className="p-4">
            <h2 className="text-xl font-bold font-readex text-electric-mint mb-4">Big Money Flow</h2>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-white">FII (Foreign)</h3>
                        <p className={`font-bold ${fiiNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {fiiNet >= 0 ? 'Net Buy' : 'Net Sell'}: {formatCurrency(fiiNet)}
                        </p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(data.fiiBuy / (data.fiiBuy + data.fiiSell)) * 100}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-white">DII (Domestic)</h3>
                        <p className={`font-bold ${diiNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {diiNet >= 0 ? 'Net Buy' : 'Net Sell'}: {formatCurrency(diiNet)}
                        </p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${(data.diiBuy / (data.diiBuy + data.diiSell)) * 100}%` }}></div>
                    </div>
                </div>
            </div>
             <p className="text-xs text-gray-400 mt-4 text-center">Buy/Sell ratio for today's provisional data.</p>
        </GlassCard>
    );
};

export default FIIDIITracker;
