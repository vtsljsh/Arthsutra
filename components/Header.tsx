
import React from 'react';
import OmniSearch from './OmniSearch';
import type { Stock } from '../types';

interface HeaderProps {
    onStockSelect: (stock: Stock) => void;
}

const Header: React.FC<HeaderProps> = ({ onStockSelect }) => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="relative">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-electric-mint/20 blur-xl rounded-full group-hover:bg-electric-mint/30 transition-all duration-500"></div>
                    
                    {/* Modern 'Bullish A' Logo */}
                    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 transform transition-transform duration-500 group-hover:scale-110">
                        {/* Outer Frame - Stylized A */}
                        <path d="M50 10L15 85H30L50 40L70 85H85L50 10Z" fill="url(#logo-gradient)" fillOpacity="0.2" />
                        <path d="M50 10L15 85H30L50 40L70 85H85L50 10Z" stroke="#6ee7b7" strokeWidth="2.5" strokeLinejoin="round" />
                        
                        {/* Rising Trend Line / Crossbar */}
                        <path d="M30 65L45 55L60 70L85 35" stroke="#6ee7b7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(110,231,183,0.8)]" />
                        
                        {/* Upward Arrow Head */}
                        <path d="M78 35H85V42" stroke="#6ee7b7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        
                        <defs>
                            <linearGradient id="logo-gradient" x1="50" y1="10" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#6ee7b7" />
                                <stop offset="1" stopColor="#6ee7b7" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black font-readex text-white tracking-tighter leading-none">
                        ARTHA<span className="text-electric-mint">SUTRA</span>
                    </h1>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">The Sovereign Analyst</span>
                </div>
            </div>
            <div className="w-full md:w-1/3 lg:w-1/4">
                <OmniSearch onStockSelect={onStockSelect} />
            </div>
        </header>
    );
};

export default Header;
