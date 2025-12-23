
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import type { Stock, Sector, AlphaAdvice, SentimentResult, GroundingChunk } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API Key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAlphaAdvice = async (topGainers: Stock[], topLosers: Stock[], sectors: Sector[]): Promise<AlphaAdvice | string> => {
    if (!API_KEY) return "API Key not configured. Cannot generate advice.";
    
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
    if (!API_KEY) return "Sentiment analysis unavailable.";

    const prompt = `
        Analyze the latest real-time news and financial data for the Indian stock: ${stock.name} (${stock.ticker}).
        Provide a concise, 1-sentence 'Sentiment Score' summarizing the current market feeling about this stock.
        Just give me the single sentence sentiment score. Do not explain your reasoning.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        const sentiment = response.text;
        // FIX: The Gemini API GroundingChunk type has optional properties, while our internal type is stricter.
        // We filter and map the API response to conform to our internal `GroundingChunk` type.
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        const sources: GroundingChunk[] = groundingChunks
            .filter(chunk => chunk.web && chunk.web.uri)
            .map(chunk => ({
                web: {
                    uri: chunk.web.uri!,
                    title: chunk.web.title || chunk.web.uri!, // Use URI as a fallback for title
                }
            }));


        return { sentiment, sources };
    } catch (error) {
        console.error("Error fetching stock sentiment from Gemini:", error);
        return "Could not analyze sentiment at this time.";
    }
};
