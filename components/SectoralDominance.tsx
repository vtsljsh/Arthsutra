
import React, { useState, useEffect } from 'react';
import { getSectoralData } from '../services/marketDataService';
import type { Sector } from '../types';
import GlassCard from './GlassCard';

const SectoralDominance: React.FC = () => {
    const [sectors, setSectors] = useState<Sector[]>([]);

    useEffect(() => {
        setSectors(getSectoralData());
    }, []);

    return (
        <GlassCard className="p-4">
            <h2 className="text-xl font-bold font-readex text-electric-mint mb-4">Sectoral Dominance</h2>
            <ul className="space-y-3">
                {sectors.map((sector) => (
                    <li key={sector.name} className="flex justify-between items-center text-sm">
                        <span className="font-semibold">{sector.name}</span>
                        <span className={`font-bold px-2 py-1 rounded-md text-xs ${sector.changePercent >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {sector.changePercent > 0 ? '+' : ''}{sector.changePercent.toFixed(2)}%
                        </span>
                    </li>
                ))}
            </ul>
        </GlassCard>
    );
};

export default SectoralDominance;
