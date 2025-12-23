
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import type { Stock, Sector, AlphaAdvice, SentimentResult, GroundingChunk, NewsArticle } from '../types';

// FIX: Per coding guidelines, initialize GoogleGenAI directly with `process.env.API_KEY`.
// The API key is assumed to be available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAlphaAdvice = async (topGainers: Stock[], topLosers: Stock[], sectors: Sector[]): Promise<AlphaAdvice | string> => {
    // FIX: Removed redundant API key check as the app assumes the key is configured.
    const prompt = `
        You are Arthasutra, a world-class Indian equity strategist. Your advice is sharp, data-driven, and adheres to strict risk management.
        Analyze the following market data:
        - Top 5 Gainers Today: ${topGainers.map(s => `${s.ticker} (+${s.changePercent.toFixed(2)}%)`).join(', ')}
        - Top 5 Losers Today: ${topLosers.map(s => `${s.ticker} (${s.changePercent.toFixed(2)}%)`).join(', ')}
        - Sectoral Rotation: ${sectors.map(s => `${s.name}: ${s.changePercent.toFixed(2)}%`).join(', ')}

        Based ONLY on this data and your internal models, provide one stock pick for each category below. Your reasoning must be sophisticated and demonstrate deep market understanding.
        CRITICAL: Ensure your advice is structured exactly in the following JSON format. Do not add any text before or after the JSON object.

        Your response MUST be a valid JSON object.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        intraday: {
                            type: Type.OBJECT,
                            properties: {
                                stock: { type: Type.STRING },
                                reason: { type: Type.STRING },
                                riskReward: { type: Type.STRING },
                            }
                        },
                        midTerm: {
                            type: Type.OBJECT,
                            properties: {
                                stock: { type: Type.STRING },
                                reason: { type: Type.STRING },
                                timeframe: { type: Type.STRING },
                            }
                        },
                        longTerm: {
                            type: Type.OBJECT,
                            properties: {
                                stock: { type: Type.STRING },
                                reason: { type: Type.STRING },
                                timeframe: { type: Type.STRING },
                            }
                        },
                    }
                }
            }
        });

        const text = response.text.trim();
        return JSON.parse(text) as AlphaAdvice;
    } catch (error) {
        console.error("Error fetching Alpha Advice from Gemini:", error);
        return "Data Latency: Neutral Stance. Could not generate AI advice.";
    }
};

export const getStockSentiment = async (stock: Stock): Promise<SentimentResult | string> => {
    // FIX: Removed redundant API key check as the app assumes the key is configured.
    const prompt = `
        Analyze the latest real-time news and financial data for the Indian stock: ${stock.name} (${stock.ticker}).
        Respond in JSON format with two keys:
        1. "sentiment": A concise, 1-sentence summary of the current market feeling.
        2. "score": A numerical score from -1.0 (very bearish) to 1.0 (very bullish).
        Your response MUST be a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentiment: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                    },
                    required: ["sentiment", "score"],
                }
            },
        });
        
        const parsedResult = JSON.parse(response.text);
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        const sources: GroundingChunk[] = groundingChunks
            .filter(chunk => chunk.web && chunk.web.uri)
            .map(chunk => ({
                web: {
                    uri: chunk.web.uri!,
                    title: chunk.web.title || chunk.web.uri!,
                }
            }));

        return { ...parsedResult, sources };
    } catch (error) {
        console.error("Error fetching stock sentiment from Gemini:", error);
        return "Could not analyze sentiment at this time.";
    }
};

export const getNewsForStock = async (stock: Stock): Promise<NewsArticle[] | string> => {
    // FIX: Removed redundant API key check as the app assumes the key is configured.
    const prompt = `
        Fetch the 5 most recent and relevant financial news headlines for the Indian stock: ${stock.name} (${stock.ticker}).
        For each headline, provide the title, the direct URL, and the source publication name.
        Your response MUST be a valid JSON object, an array of articles.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            url: { type: Type.STRING },
                            source: { type: Type.STRING },
                        },
                        required: ["title", "url", "source"],
                    }
                }
            },
        });
        return JSON.parse(response.text) as NewsArticle[];
    } catch (error) {
        console.error("Error fetching news from Gemini:", error);
        return "Could not fetch news at this time.";
    }
};
