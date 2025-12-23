
import React from 'react';
import PulseMap from './PulseMap';
import FIIDIITracker from './FIIDIITracker';
import SectoralDominance from './SectoralDominance';
import PreMarketSimulator from './PreMarketSimulator';
import AlphaAdvice from './AlphaAdvice';
import type { Stock } from '../types';

interface DashboardProps {
    onStockSelect: (stock: Stock) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStockSelect }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <PulseMap onStockSelect={onStockSelect} />
                <AlphaAdvice />
            </div>
            <div className="lg:col-span-1 space-y-6">
                <SectoralDominance />
                <FIIDIITracker />
                <PreMarketSimulator />
            </div>
        </div>
    );
};

export default Dashboard;
