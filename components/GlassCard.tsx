
import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-glass-bg border border-glass-border rounded-xl shadow-lg backdrop-blur-md ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;
