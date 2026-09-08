import { NextResponse } from 'next/server';
import { analyzeStockWithAI } from '@/lib/ai';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { ticker } = await req.json();

    // 1. Fetch Real Market Data (Example using Finnhub for price/sentiment)
    const quoteRes = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINNHUB_API_KEY}`);
    
    // In a real app, fetch RSI, MACD, Moving Averages from Alpha Vantage or Polygon here.
    const marketData = {
      currentPrice: quoteRes.data.c,
      highOfDay: quoteRes.data.h,
      lowOfDay: quoteRes.data.l,
      openPrice: quoteRes.data.o,
      previousClose: quoteRes.data.pc,
      // Mocked technicals for example purposes:
      rsi: 58,
      macd: "Bullish Crossover",
      newsSentiment: "Positive"
    };

    // 2. Pass to Gemini Flash AI
    const aiPrediction = await analyzeStockWithAI(ticker, marketData);

    // 3. Save to Database for Backtesting
    await prisma.prediction.create({
      data: {
        ticker: ticker,
        timeHorizonDays: 30, // Defaulting to 30 days for this example
        probUp: aiPrediction.probability_up,
        probDown: aiPrediction.probability_down,
        probFlat: aiPrediction.probability_flat,
        confidence: aiPrediction.confidence,
        direction: aiPrediction.direction,
        priceAtPrediction: marketData.currentPrice
      }
    });

    return NextResponse.json({ ...aiPrediction, currentPrice: marketData.currentPrice });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to analyze stock" }, { status: 500 });
  }
}
