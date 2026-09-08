"use client";
import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ ticker: ticker.toUpperCase() })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500">
      {/* Navbar */}
      <nav className="border-b border-gray-800 p-4 flex justify-between items-center bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          StockSignal AI
        </h1>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>S&P 500: +1.2%</span>
          <span>NASDAQ: +1.5%</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        
        {/* Disclaimer */}
        <div className="bg-yellow-900/20 border border-yellow-700/50 text-yellow-300 p-3 rounded-lg flex items-center gap-3 text-sm mb-8">
          <AlertTriangle size={16} />
          <p>Predictions are estimates generated from historical and current market data by AI. They are not guarantees or financial advice.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={analyzeStock} className="relative max-w-xl mx-auto mb-12">
          <input 
            type="text" 
            placeholder="Search any ticker (e.g., NVDA, AAPL)..." 
            className="w-full bg-gray-900 border border-gray-700 rounded-full py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-blue-500 transition-colors shadow-2xl"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-500" />
          <button type="submit" disabled={loading} className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-medium transition-colors">
            {loading ? "Scanning..." : "Analyze"}
          </button>
        </form>

        {/* Result Card (Glassmorphism) */}
        {result && (
          <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start border-b border-gray-800 pb-6 mb-6">
              <div>
                <h2 className="text-4xl font-bold flex items-center gap-4">
                  {result.ticker} 
                  <span className="text-2xl text-gray-400 font-normal">${result.currentPrice}</span>
                </h2>
                <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${result.direction === 'Bullish' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                  {result.direction === 'Bullish' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {result.direction} Outlook
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Probability of Increase</p>
                <p className="text-5xl font-bold text-emerald-400">{result.probability_up}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Confidence</p>
                <p className="text-xl font-semibold">{result.confidence}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Risk Level</p>
                <p className="text-xl font-semibold">{result.risk}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Time Horizon</p>
                <p className="text-xl font-semibold">{result.time_horizon}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Tech Score</p>
                <p className="text-xl font-semibold">{result.technical_score}/100</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">AI Reasoning</h3>
              <p className="text-gray-400 leading-relaxed bg-gray-950 p-4 rounded-xl border border-gray-800">
                "{result.explanation}"
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
