
import React from 'react';

interface SentimentGaugeProps {
    score: number; // -1 (bearish) to 1 (bullish)
}

const SentimentGauge: React.FC<SentimentGaugeProps> = ({ score }) => {
    const clampedScore = Math.max(-1, Math.min(1, score));
    // Map score to angle: -1 -> -90deg, 0 -> 0deg, 1 -> 90deg
    const angle = clampedScore * 90; 
    const percentage = ((clampedScore + 1) / 2) * 100;

    const getColor = (s: number) => {
        if (s < -0.33) return '#ef4444'; // Red
        if (s > 0.33) return '#22c55e'; // Green
        return '#f59e0b'; // Amber/Yellow
    };
    
    const color = getColor(clampedScore);
    const sentimentText = clampedScore < -0.33 ? 'Bearish' : clampedScore > 0.33 ? 'Bullish' : 'Neutral';

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full">
            <svg viewBox="0 0 100 60" className="w-full max-w-[200px]">
                {/* Background Arc */}
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="rgba(75, 85, 99, 0.5)"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                {/* Foreground Arc Gradient */}
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                </defs>
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    style={{
                        strokeDasharray: 125.6,
                        strokeDashoffset: 125.6 * (1 - percentage / 100),
                        transition: 'stroke-dashoffset 1s ease-in-out',
                    }}
                />
                {/* Needle */}
                <g transform={`rotate(${angle} 50 50)`} style={{ transition: 'transform 1s ease-in-out' }}>
                    <path d="M 50 50 L 50 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="4" fill="white" />
                </g>
            </svg>
            <div className="absolute" style={{bottom: '5%'}}>
                 <span className="text-xl font-bold" style={{ color }}>
                    {sentimentText}
                </span>
            </div>
        </div>
    );
};

export default SentimentGauge;
