
import React, { useState, useEffect, useRef } from 'react';
import { searchStocks } from '../services/marketDataService';
import type { Stock } from '../types';

interface OmniSearchProps {
    onStockSelect: (stock: Stock) => void;
}

const OmniSearch: React.FC<OmniSearchProps> = ({ onStockSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Stock[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (query.length > 1) {
            const fetchedStocks = searchStocks(query);
            setResults(fetchedStocks);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query]);

    const handleSelect = (stock: Stock) => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        onStockSelect(stock);
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search e.g. RELIANCE..."
                    className="w-full px-4 py-2 bg-glass-bg border border-glass-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-mint"
                />
                 <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            {isOpen && results.length > 0 && (
                <div className="absolute z-20 w-full mt-2">
                    <ul className="bg-glass-bg border border-glass-border rounded-lg shadow-lg backdrop-blur-md overflow-hidden">
                        {results.map((stock) => (
                            <li
                                key={stock.ticker}
                                onClick={() => handleSelect(stock)}
                                className="px-4 py-3 cursor-pointer hover:bg-deep-indigo/50 transition-colors duration-200"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-white">{stock.ticker}</p>
                                        <p className="text-xs text-gray-400 truncate">{stock.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            ₹{stock.ltp.toFixed(2)}
                                        </p>
                                        <p className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OmniSearch;
