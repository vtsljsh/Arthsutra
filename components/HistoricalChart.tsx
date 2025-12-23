
import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData, Time } from 'lightweight-charts';

interface HistoricalChartProps {
    data: LineData<Time>[];
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ data }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) return;

        // Initialize chart only once
        if (!chartRef.current) {
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 300,
                layout: {
                    background: { color: 'transparent' },
                    textColor: '#d1d5db', // gray-300
                },
                grid: {
                    vertLines: { color: 'rgba(75, 85, 99, 0.5)' },
                    horzLines: { color: 'rgba(75, 85, 99, 0.5)' },
                },
                timeScale: {
                    borderColor: '#4b5563', // gray-600
                    timeVisible: true,
                    secondsVisible: false,
                },
                crosshair: {
                    mode: 1, // Magnet effect
                },
                handleScroll: {
                    mouseWheel: true,
                },
                handleScale: {
                    pinch: true,
                    axisPressedMouseMove: true,
                },
            });
            chartRef.current = chart;

            const series = chart.addAreaSeries({
                lineColor: '#6ee7b7', // electric-mint
                topColor: 'rgba(110, 231, 183, 0.4)',
                bottomColor: 'rgba(110, 231, 183, 0)',
                lineWidth: 2,
            });
            seriesRef.current = series;
        }

        // Set data for the series
        seriesRef.current?.setData(data);
        chartRef.current.timeScale().fitContent();

        // Handle resize
        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.resize(chartContainerRef.current.clientWidth, 300);
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [data]); // Re-run effect only when data changes

    // Cleanup chart on final unmount
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    return <div ref={chartContainerRef} className="w-full h-[300px]" />;
};

export default HistoricalChart;
