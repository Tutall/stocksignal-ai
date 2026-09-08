"use client";
import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, AlertCircle, Bookmark, BarChart2 } from 'lucide-react';

export default function StockSignalApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const runAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ ticker: ticker.toUpperCase() })
      });
      setAnalysis(await res.json());
      setActiveTab('analysis');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Helper for progress bars
  const ScoreBar = ({ label, score }: { label: string, score: number }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>{label}</span>
        <span>{score}/100</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${score > 75 ? 'bg-green-500' : score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans md:px-8">
      {/* Navbar */}
      <nav className="p-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-800 gap-4">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center gap-2">
          <Activity /> StockSignal AI
        </h1>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-gray-800' : ''}`}>Scanner</button>
          <button onClick={() => setActiveTab('trackRecord')} className={`px-4 py-2 rounded-lg ${activeTab === 'trackRecord' ? 'bg-gray-800' : ''}`}>🧪 Track Record</button>
          <button onClick={() => setActiveTab('watchlist')} className={`px-4 py-2 rounded-lg ${activeTab === 'watchlist' ? 'bg-gray-800' : ''}`}>⭐ Watchlist</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4">
        
        {/* Universal Search Bar */}
        <form onSubmit={runAnalysis} className="relative max-w-2xl mx-auto mb-10">
          <input 
            type="text" 
            placeholder="Search ticker (e.g., AAPL, NVDA)..." 
            className="w-full bg-gray-900 border border-gray-700 rounded-full py-4 pl-12 pr-32 text-lg focus:outline-none focus:border-emerald-500"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-500" />
          <button type="submit" disabled={loading} className="absolute right-2 top-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-full font-bold">
            {loading ? "Scanning..." : "Analyze"}
          </button>
        </form>

        {/* VIEW: DASHBOARD (Top Picks) */}
        {activeTab === 'dashboard' && !analysis && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🏆 AI Top Picks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['NVDA', 'AMD', 'AAPL'].map((stock, idx) => (
                <div key={stock} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500 cursor-pointer transition-colors" onClick={() => { setTicker(stock); setActiveTab('analysis'); }}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{stock}</h3>
                    <span className="bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded text-sm font-bold">#{idx + 1}</span>
                  </div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">82% <span className="text-sm text-gray-500 font-normal">UP</span></div>
                  <p className="text-sm text-gray-400">Risk: Medium • Horizon: 30 Days</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ANALYSIS */}
        {activeTab === 'analysis' && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
            
            {/* Left Column: Data & Chart */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-4xl font-bold">{analysis.ticker}</h2>
                    <p className="text-xl text-gray-400">${analysis.marketData.price} <span className="text-green-500">{analysis.marketData.change}</span></p>
                  </div>
                  <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"><Bookmark size={18} /> Save</button>
                </div>
                
                {/* Mock Chart Area */}
                <div className="h-64 bg-gray-950 rounded-lg flex items-center justify-center border border-gray-800 mb-6">
                  <BarChart2 size={48} className="text-gray-700" />
                  <span className="ml-2 text-gray-600">Interactive Price Chart Placeholder</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-gray-950 p-3 rounded">RSI: <span className="font-bold">{analysis.marketData.rsi}</span></div>
                  <div className="bg-gray-950 p-3 rounded">MACD: <span className="font-bold">{analysis.marketData.macd}</span></div>
                  <div className="bg-gray-950 p-3 rounded">P/E: <span className="font-bold">{analysis.marketData.pe}</span></div>
                  <div className="bg-gray-950 p-3 rounded">Vol: <span className="font-bold">{analysis.marketData.volume}</span></div>
                </div>
              </div>

              {/* AI News Analysis */}
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">📰 AI News Analysis</h3>
                <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${analysis.newsAnalysis.sentiment === 'Bullish' ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-900/50' : 'bg-red-900/20 text-red-400 border border-red-900/50'}`}>
                  {analysis.newsAnalysis.sentiment === 'Bullish' ? '🟢' : '🔴'} {analysis.newsAnalysis.sentiment} Sentiment
                </div>
                <p className="text-gray-300">{analysis.newsAnalysis.summary}</p>
              </div>
            </div>

            {/* Right Column: AI Predictions & Scores */}
            <div className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <h3 className="text-xl font-bold mb-6">🤖 AI Prediction</h3>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Probability UP</span>
                  <span className="text-2xl font-bold text-emerald-400">{analysis.probabilities.up}%</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Probability FLAT</span>
                  <span className="text-lg font-bold text-yellow-400">{analysis.probabilities.flat}%</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Probability DOWN</span>
                  <span className="text-lg font-bold text-red-400">{analysis.probabilities.down}%</span>
                </div>

                <div className="bg-gray-950 p-4 rounded-lg mb-6 text-sm">
                  <p><strong>Confidence:</strong> {analysis.confidence}</p>
                  <p><strong>Horizon:</strong> {analysis.timeHorizon}</p>
                </div>

                <h4 className="font-bold mb-4 text-gray-300">🧠 AI Score Breakdown</h4>
                <ScoreBar label="Technical Analysis" score={analysis.scores.technical} />
                <ScoreBar label="Fundamentals" score={analysis.scores.fundamentals} />
                <ScoreBar label="Momentum" score={analysis.scores.momentum} />
                <ScoreBar label="News Sentiment" score={analysis.scores.news} />
                <ScoreBar label="Volume" score={analysis.scores.volume} />

                <div className="mt-6 border-t border-gray-800 pt-4">
                  <p className="text-sm text-gray-400 italic">" {analysis.explanation} "</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: TRACK RECORD */}
        {activeTab === 'trackRecord' && (
          <div className="animate-in fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">🧪 AI Track Record</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900 p-4 rounded-xl text-center border border-gray-800"><p className="text-gray-400 text-sm">Win Rate</p><p className="text-3xl font-bold text-emerald-400">74%</p></div>
              <div className="bg-gray-900 p-4 rounded-xl text-center border border-gray-800"><p className="text-gray-400 text-sm">Avg Return</p><p className="text-3xl font-bold text-emerald-400">+8.2%</p></div>
              <div className="bg-gray-900 p-4 rounded-xl text-center border border-gray-800"><p className="text-gray-400 text-sm">vs S&P 500</p><p className="text-3xl font-bold text-blue-400">+3.1%</p></div>
              <div className="bg-gray-900 p-4 rounded-xl text-center border border-gray-800"><p className="text-gray-400 text-sm">Predictions</p><p className="text-3xl font-bold">1,248</p></div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-950 text-gray-400 text-sm">
                  <tr><th className="p-4">Date</th><th className="p-4">Ticker</th><th className="p-4">AI Prediction</th><th className="p-4">Result (30 Days)</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-800">
                    <td className="p-4">Sep 1, 2026</td><td className="p-4 font-bold">NVDA</td><td className="p-4 text-emerald-400">74% UP</td><td className="p-4 text-emerald-400">+11.2%</td><td className="p-4">✅ Correct</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="p-4">Aug 28, 2026</td><td className="p-4 font-bold">TSLA</td><td className="p-4 text-emerald-400">65% UP</td><td className="p-4 text-red-400">-2.1%</td><td className="p-4">❌ Missed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
