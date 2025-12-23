
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StockDetail from './components/StockDetail';
import type { Stock } from './types';

const App: React.FC = () => {
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    return (
        <div 
            className="min-h-screen bg-deep-indigo font-sans bg-cover bg-fixed"
            style={{ backgroundImage: "url('https://picsum.photos/seed/arthasutra-bg/2000/1200')" }}
        >
            <div className="absolute inset-0 bg-deep-indigo/80 backdrop-blur-sm"></div>
            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
                <Header onStockSelect={setSelectedStock} />
                <main className="mt-6">
                    {selectedStock ? (
                        <StockDetail stock={selectedStock} onBack={() => setSelectedStock(null)} />
                    ) : (
                        <Dashboard onStockSelect={setSelectedStock} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
