# StockSignal AI

AI-powered stock signal analysis platform using Next.js and Google's Generative AI.

## Features

- 🤖 **AI-Powered Analysis** - Uses Google Gemini for real-time stock prediction
- 📊 **Multi-Factor Scoring** - Technical, fundamentals, momentum, news, volume analysis
- 🧪 **Track Record** - Historical prediction accuracy and performance metrics
- ⭐ **Watchlist Management** - Save and track your favorite stocks
- 📰 **News Sentiment** - AI analysis of recent news and market sentiment
- 🎯 **Probability Predictions** - UP/FLAT/DOWN predictions with confidence levels

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Generative AI (Gemini)
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Tutall/stocksignal-ai.git
cd stocksignal-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your credentials:
```
GOOGLE_GEMINI_API_KEY=your_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/stocksignal
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
stocksignal-ai/
├── app/
│   ├── page.tsx              # Main dashboard
│   └── api/
│       └── analyze/
│           └── route.ts      # Stock analysis API
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
│   └── CNAME                 # Custom domain config
└── next.config.js            # Next.js configuration
```

## Database Schema

- **User**: User profiles and authentication
- **Watchlist**: User-tracked stocks
- **Alert**: Conditional price alerts
- **Prediction**: Historical predictions for backtesting

## API Endpoints

### POST `/api/analyze`
Analyzes a stock ticker and returns AI predictions.

**Request:**
```json
{ "ticker": "NVDA" }
```

**Response:**
```json
{
  "ticker": "NVDA",
  "probabilities": { "up": 78, "down": 15, "flat": 7 },
  "confidence": "High",
  "timeHorizon": "30 days",
  "scores": { "technical": 85, "fundamentals": 70, "momentum": 90, "news": 88, "volume": 80 },
  "explanation": "...",
  "newsAnalysis": { "sentiment": "Bullish", "summary": "..." },
  "marketData": { "price": 145.32, "change": "+1.2%", ... }
}
```

## Disclaimer

⚠️ **Predictions are estimates generated from historical and current market data by AI. They are not guarantees or financial advice.** Always conduct your own research and consult with a financial advisor before making investment decisions.

## Environment Variables

Create a `.env.local` file:

```env
# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stocksignal

# Deployment
NEXT_PUBLIC_APP_URL=https://stocksignalai.com
```

## Deployment

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Set custom domain to `stocksignalai.com`
3. GitHub Actions will automatically deploy on every push to `main`

See `.github/workflows/deploy.yml` for workflow details.

## Roadmap

- [ ] Real market data integration (Finnhub, Alpha Vantage)
- [ ] User authentication & profiles
- [ ] Advanced backtesting engine
- [ ] Mobile app
- [ ] Real-time alerts & notifications
- [ ] Social features (share predictions, leaderboards)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and feature requests, please open a GitHub issue.

---

**StockSignal AI** - Making AI-powered stock analysis accessible to everyone.
