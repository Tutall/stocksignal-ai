import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function analyzeStockWithAI(ticker: string, marketData: any) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    You are StockSignal AI, an advanced financial analysis model.
    Analyze the following structured market data for ${ticker} and return a JSON object with your probabilities.
    
    Data: ${JSON.stringify(marketData)}
    
    CRITICAL INSTRUCTION: Do NOT guarantee returns. Treat this as an estimate.
    
    Return EXACTLY this JSON structure:
    {
      "ticker": "${ticker}",
      "probability_up": <number 0-100>,
      "probability_down": <number 0-100>,
      "probability_flat": <number 0-100>,
      "confidence": "<High/Medium/Low>",
      "direction": "<Bullish/Bearish/Neutral>",
      "risk": "<High/Medium/Low>",
      "time_horizon": "<1-4 weeks>",
      "technical_score": <number 0-100>,
      "fundamental_score": <number 0-100>,
      "sentiment_score": <number 0-100>,
      "momentum_score": <number 0-100>,
      "explanation": "<A detailed 2-3 sentence explanation of the reasoning>"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
