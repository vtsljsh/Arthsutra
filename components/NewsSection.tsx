
import React from 'react';
import type { NewsArticle } from '../types';

interface NewsSectionProps {
    articles: NewsArticle[];
    isLoading: boolean;
    error: string | null;
}

const NewsSection: React.FC<NewsSectionProps> = ({ articles, isLoading, error }) => {
    const renderContent = () => {
        if (isLoading) {
            return Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4 py-1">
                    <div className="flex-1 space-y-3">
                        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            ));
        }

        if (error) {
            return <p className="text-red-400 text-sm">{error}</p>;
        }

        if (articles.length === 0) {
            return <p className="text-gray-400 text-sm">No recent news found.</p>;
        }

        return (
            <ul className="space-y-3">
                {articles.slice(0, 5).map((article, index) => (
                    <li key={index} className="border-b border-glass-border last:border-b-0 pb-2 last:pb-0">
                        <a 
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <h4 className="text-sm font-semibold text-gray-200 group-hover:text-electric-mint transition-colors">{article.title}</h4>
                            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{article.source}</p>
                        </a>
                    </li>
                ))}
            </ul>
        );
    };

    return (
         <div className="bg-deep-indigo/50 p-4 rounded-lg">
            <h3 className="text-electric-mint font-semibold mb-3">Latest News</h3>
            <div className="overflow-y-auto max-h-56 pr-2">
                {renderContent()}
            </div>
        </div>
    );
};

export default NewsSection;
