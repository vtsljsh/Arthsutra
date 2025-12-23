
import React, { useState, useEffect } from 'react';
import { treemap, hierarchy } from 'd3-hierarchy';
import { scaleLinear } from 'd3-scale';
import { getPulseMapData } from '../services/marketDataService';
import type { Stock } from '../types';
import GlassCard from './GlassCard';

interface TreemapNode extends Stock {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
}

interface PulseMapProps {
    onStockSelect: (stock: Stock) => void;
}

const PulseMap: React.FC<PulseMapProps> = ({ onStockSelect }) => {
    const [nodes, setNodes] = useState<TreemapNode[]>([]);

    useEffect(() => {
        const data = getPulseMapData();
        const root = hierarchy({ children: data }).sum(d => (d as Stock).marketCap);

        const treemapLayout = treemap<any>()
            .size([1000, 600]) // Internal resolution, will be scaled
            .paddingInner(4)
            .paddingOuter(6);

        treemapLayout(root);
        
        const leafNodes = root.leaves().map(leaf => ({
            ...(leaf.data as Stock),
            x0: leaf.x0,
            x1: leaf.x1,
            y0: leaf.y0,
            y1: leaf.y1,
        }));

        setNodes(leafNodes as TreemapNode[]);
    }, []);

    const colorScale = scaleLinear<string>()
        .domain([-3, 0, 3])
        .range(['#ef4444', '#4b5563', '#22c55e']);

    return (
        <GlassCard className="p-4 h-[400px] md:h-[600px]">
            <h2 className="text-xl font-bold font-readex text-electric-mint mb-4">The Pulse Map (Nifty 50)</h2>
            <div className="w-full h-[calc(100%-40px)]">
                {nodes.length > 0 ? (
                    <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                        {nodes.map(node => {
                            const width = node.x1 - node.x0;
                            const height = node.y1 - node.y0;
                            const fontSize = Math.max(8, Math.min(width / 4, height / 3, 20));
                            return (
                                <g 
                                    key={node.ticker} 
                                    transform={`translate(${node.x0},${node.y0})`}
                                    onClick={() => onStockSelect(node)}
                                    className="cursor-pointer group"
                                >
                                    <rect
                                        width={width}
                                        height={height}
                                        fill={colorScale(node.changePercent)}
                                        className="transition-all duration-300 group-hover:stroke-electric-mint group-hover:stroke-2"
                                        rx={8}
                                        ry={8}
                                    />
                                    <foreignObject width={width} height={height} className="overflow-hidden p-1 text-white text-center flex flex-col justify-center items-center pointer-events-none">
                                        <div className="font-bold" style={{ fontSize: `${fontSize}px` }}>
                                            {node.ticker}
                                        </div>
                                        <div className="font-medium" style={{ fontSize: `${fontSize * 0.7}px` }}>
                                            {node.changePercent > 0 ? '+' : ''}{node.changePercent.toFixed(2)}%
                                        </div>
                                    </foreignObject>
                                </g>
                            );
                        })}
                    </svg>
                ) : (
                     <div className="flex items-center justify-center h-full text-gray-400">Loading Market Pulse...</div>
                )}
            </div>
        </GlassCard>
    );
};

export default PulseMap;
