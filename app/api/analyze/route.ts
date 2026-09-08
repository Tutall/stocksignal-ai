import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { ticker } = await req.json();

    // 1. Fetch Real Data (Replace mock with AlphaVantage/Finnhub fetch calls)
    const marketData = {
      ticker,
      price: 145.32,
      change: "+1.2%",
      volume: "52M",
      rsi: 62,
      macd: "Bullish",
      pe: 28.5,
      recentNews: [
        "Company announces record breaking revenue for Q3.",
        "Analyst upgrades stock to 'Strong Buy' citing AI growth."
      ]
    };

    // 2. Call Gemini Flash for structured analysis
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze this market data for ${ticker}: ${JSON.stringify(marketData)}.
      Return EXACT JSON structure:
      {
        "ticker": "${ticker}",
        "probabilities": { "up": 78, "down": 15, "flat": 7 },
        "confidence": "High",
        "timeHorizon": "30 days",
        "scores": { "technical": 85, "fundamentals": 70, "momentum": 90, "news": 88, "volume": 80 },
        "explanation": "Short 2 sentence explanation...",
        "newsAnalysis": { "sentiment": "Bullish", "summary": "News is largely positive..." }
      }
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = JSON.parse(result.response.text());

    // 3. Save to DB for Backtesting Track Record
    await prisma.prediction.create({
      data: {
        ticker: ticker,
        timeHorizonDays: 30,
        probUp: aiResponse.probabilities.up,
        probDown: aiResponse.probabilities.down,
        probFlat: aiResponse.probabilities.flat,
        confidence: aiResponse.confidence,
        priceAtPrediction: marketData.price
      }
    });

    return NextResponse.json({ ...aiResponse, marketData });
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
