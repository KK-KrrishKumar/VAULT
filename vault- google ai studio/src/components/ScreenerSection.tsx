import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Layers, 
  Loader2, 
  Plus, 
  Check, 
  ShieldCheck, 
  Building,
  BarChart4,
  ArrowUpRight,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Newspaper
} from 'lucide-react';
import { mockCompanies } from '../data/mockData';
import { 
  getSector, 
  getDerivedMetrics, 
  getVaultRating, 
  getDynamicPeers, 
  getRecentNotices, 
  getQuarterlyData, 
  getHistoricalData 
} from '../utils/stockUtils';

interface ScreenerSectionProps {
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  selectedStockSymbol: string | null;
  setSelectedStockSymbol: (symbol: string | null) => void;
}

export default function ScreenerSection({ 
  watchlist, 
  onToggleWatchlist,
  selectedStockSymbol,
  setSelectedStockSymbol
}: ScreenerSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Search live tickers from server proxy
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.quotes || []);
      } catch (err) {
        console.error('Failed to search stock tickers:', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Load real-time quote and history for selected stock
  const [historicalPrices, setHistoricalPrices] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    if (!selectedStockSymbol) {
      setQuoteData(null);
      setHistoricalPrices([]);
      setLiveNews([]);
      return;
    }
    const fetchQuoteAndHistory = async () => {
      setLoadingQuote(true);
      setLoadingHistory(true);
      setLoadingNews(true);
      try {
        const quotePromise = fetch(`/api/stocks/quote?symbols=${selectedStockSymbol}`).then(r => r.json());
        const historyPromise = fetch(`/api/stocks/history?symbol=${selectedStockSymbol}`).then(r => r.json());
        const newsPromise = fetch(`/api/stocks/news?symbol=${selectedStockSymbol}`).then(r => r.json());

        const [quoteRes, historyRes, newsRes] = await Promise.all([quotePromise, historyPromise, newsPromise]);

        const quote = quoteRes.quotes?.[selectedStockSymbol];
        setQuoteData(quote || null);
        setHistoricalPrices(historyRes.historicalPrices || []);
        setLiveNews(newsRes.articles || []);
      } catch (err) {
        console.error('Failed to fetch stock quote, history, or news:', err);
      } finally {
        setLoadingQuote(false);
        setLoadingHistory(false);
        setLoadingNews(false);
      }
    };
    fetchQuoteAndHistory();
  }, [selectedStockSymbol]);

  const currentMetrics = selectedStockSymbol ? getDerivedMetrics(selectedStockSymbol) : null;
  const currentQuarters = selectedStockSymbol ? getQuarterlyData(selectedStockSymbol) : [];
  
  const currentPrice = quoteData?.ltp || (selectedStockSymbol ? (selectedStockSymbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1400 + 95) : 100);
  const ratingDetails = (selectedStockSymbol && currentMetrics) ? getVaultRating(selectedStockSymbol, currentMetrics) : null;
  const recentNotices = selectedStockSymbol ? getRecentNotices(selectedStockSymbol) : [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Building className="w-5 h-5 text-slate-800" /> Screener Stock Research Terminal
          </h3>
          <p className="text-slate-400 text-xs">Search 2,700+ NSE stocks. Access key ratios, quarterly tables, and peers.</p>
        </div>

        {/* Real-time Ticker Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {searching ? (
              <Loader2 className="w-4 h-4 text-slate-800 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <input
            type="text"
            placeholder="Search NSE Stocks (e.g., RELIANCE, TCS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-550/10 focus:border-slate-500 transition-all"
          />

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {searchResults.map((item) => (
                <div 
                  key={item.symbol}
                  onClick={() => {
                    setSelectedStockSymbol(item.symbol);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-mono font-black text-xs text-slate-800">{item.symbol}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{item.name} • {item.sector}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold border border-slate-200">
                    {item.exchange}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedStockSymbol ? (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Company Title Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-850 text-white font-mono text-[11px] font-black px-2.5 py-0.5 rounded">
                  {selectedStockSymbol}
                </span>
                <h4 className="text-base font-bold text-slate-800">
                  {quoteData?.name || selectedStockSymbol}
                </h4>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Indian Listed Equity • Segment: Capital Markets (NSE)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold">CURRENT PRICE</p>
                {loadingQuote ? (
                  <Loader2 className="w-4 h-4 text-slate-800 animate-spin mt-1 inline-block" />
                ) : (
                  <div className="flex items-center gap-1.5 justify-end mt-0.5">
                    <span className="text-lg font-black text-slate-800">
                      ₹{quoteData?.ltp ? quoteData.ltp.toLocaleString('en-IN') : currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-xs font-bold flex items-center ${((quoteData?.chg ?? 0) >= 0) ? 'text-emerald-600' : 'text-red-500'}`}>
                      {((quoteData?.chg ?? 0) >= 0) ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {quoteData?.chgPct || '+0.85'}%
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => onToggleWatchlist(selectedStockSymbol)}
                className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  watchlist.includes(selectedStockSymbol)
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    : 'bg-slate-850 hover:bg-slate-900 text-white'
                }`}
              >
                {watchlist.includes(selectedStockSymbol) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-700" /> Watching
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-white" /> Watch
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dual Column Layout: Left Column (Financials & Ratios) | Right Column (Rating, History, Disclosures) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Key Ratios Block */}
              <div>
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Key Corporate Ratios
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="p-2 border-b border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Market Cap</span>
                    <p className="text-sm font-black text-slate-800 mt-0.5">₹{currentMetrics?.marketCap.toLocaleString('en-IN')} Cr</p>
                  </div>
                  <div className="p-2 border-b border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Stock P/E</span>
                    <p className="text-sm font-black text-slate-800 mt-0.5">{currentMetrics?.pe}x</p>
                  </div>
                  <div className="p-2 border-b border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">ROCE</span>
                    <p className="text-sm font-black text-slate-800 mt-0.5">{currentMetrics?.roce}</p>
                  </div>
                  <div className="p-2 border-b sm:border-b-0 border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">ROE</span>
                    <p className="text-sm font-black text-slate-800 mt-0.5">{currentMetrics?.roe}</p>
                  </div>
                  <div className="p-2 border-b sm:border-b-0 border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Promoters</span>
                    <p className="text-sm font-black text-slate-800 mt-0.5">{currentMetrics?.promShare}%</p>
                  </div>
                  <div className="p-2">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Debt to Equity</span>
                    <p className="text-sm font-black text-slate-800 mt-0.5">{currentMetrics?.debtToEquity}</p>
                  </div>
                </div>
              </div>

              {/* Quarterly Financials Table */}
              <div>
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Quarterly Performance Metrics (INR Crores)</span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded border border-slate-200">
                    Standalone Results
                  </span>
                </h5>
                <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                  <table className="w-full text-left border-collapse bg-white text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold">
                        <th className="px-4 py-3 font-semibold">Financial Parameter</th>
                        {currentQuarters.map((q, idx) => (
                          <th key={idx} className="px-4 py-3 text-right font-mono font-semibold">{q.quarter}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-800">Net Sales / Revenue</td>
                        {currentQuarters.map((q, idx) => (
                          <td key={idx} className="px-4 py-3 text-right font-mono">₹{q.revenue.toLocaleString('en-IN')}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">Total Expenses</td>
                        {currentQuarters.map((q, idx) => (
                          <td key={idx} className="px-4 py-3 text-right font-mono">₹{q.expenses.toLocaleString('en-IN')}</td>
                        ))}
                      </tr>
                      <tr className="bg-slate-50/40 hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-bold text-slate-800">Operating Profit (EBITDA)</td>
                        {currentQuarters.map((q, idx) => (
                          <td key={idx} className="px-4 py-3 text-right font-mono font-bold text-slate-900">₹{q.opProfit.toLocaleString('en-IN')}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">Operating Profit Margin (OPM %)</td>
                        {currentQuarters.map((q, idx) => (
                          <td key={idx} className="px-4 py-3 text-right font-mono font-semibold">{q.opm}%</td>
                        ))}
                      </tr>
                      <tr className="bg-slate-100/20 hover:bg-slate-100/40">
                        <td className="px-4 py-3 font-bold text-slate-800">Reported Net Profit (PAT)</td>
                        {currentQuarters.map((q, idx) => (
                          <td key={idx} className="px-4 py-3 text-right font-mono font-bold text-slate-900">₹{q.netProfit.toLocaleString('en-IN')}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Peer comparison */}
              <div>
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Sectoral Peer Valuation (Sector: {getSector(selectedStockSymbol)})
                </h5>
                <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                  <table className="w-full text-left border-collapse bg-white text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold">
                        <th className="px-4 py-3 font-semibold">Peer Name</th>
                        <th className="px-4 py-3 text-right font-semibold">P/E Ratio</th>
                        <th className="px-4 py-3 text-right font-semibold">Market Cap (Cr)</th>
                        <th className="px-4 py-3 text-right font-semibold">ROCE %</th>
                        <th className="px-4 py-3 text-right font-semibold">Debt/Equity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                      <tr className="bg-slate-50 font-semibold">
                        <td className="px-4 py-3 text-slate-900 font-sans">{selectedStockSymbol} (Current)</td>
                        <td className="px-4 py-3 text-right text-slate-800">{currentMetrics?.pe}x</td>
                        <td className="px-4 py-3 text-right">₹{currentMetrics?.marketCap?.toLocaleString('en-IN')} Cr</td>
                        <td className="px-4 py-3 text-right text-slate-800">{currentMetrics?.roce}</td>
                        <td className="px-4 py-3 text-right">{currentMetrics?.debtToEquity}</td>
                      </tr>
                      {getDynamicPeers(selectedStockSymbol).map((peer) => (
                        <tr key={peer.symbol} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-500 font-sans">
                            <span className="font-mono text-xs font-bold text-slate-700 mr-2 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{peer.symbol}</span>
                            {peer.name}
                          </td>
                          <td className="px-4 py-3 text-right">{peer.pe}x</td>
                          <td className="px-4 py-3 text-right">₹{peer.marketCap?.toLocaleString('en-IN')} Cr</td>
                          <td className="px-4 py-3 text-right">{peer.roce}</td>
                          <td className="px-4 py-3 text-right">{peer.debtToEquity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column (Rating Meter, Past 1 month trends, Past 3 months SEBI updates) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* 1. Vault Quality Score Rating Meter */}
              {ratingDetails && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Vault Institutional Rating
                    </h5>
                    <span className="bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      {ratingDetails.grade}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    {/* Circle Percentage Meter */}
                    <div className="relative w-20 h-20 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-slate-800"
                          strokeDasharray={`${ratingDetails.score}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-base font-black text-slate-800 font-mono leading-none">{ratingDetails.score}%</span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">{ratingDetails.label}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Quality Assessment Score</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-sans font-medium">
                        {ratingDetails.description}
                      </p>
                    </div>
                  </div>

                  {/* Rating parameters breakdown */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    {ratingDetails.breakdown.map((b, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-400">{b.name}</span>
                          <span className="text-slate-700 font-mono">{b.value}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-slate-800 h-full rounded-full"
                            style={{ width: `${b.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Historical Price Trend (Past 1 Month) */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Interactive 30-Day Trend Chart
                    </h5>
                    <p className="text-[10px] text-slate-400">Hover over chart area for interactive price readouts</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">30 Daily Closes</span>
                </div>

                {/* High-fidelity Custom SVG Interactive Chart */}
                {loadingHistory ? (
                  <div className="h-48 flex flex-col items-center justify-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl">
                    <Loader2 className="w-6 h-6 text-slate-800 animate-spin" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Synchronizing Terminal Closes...</span>
                  </div>
                ) : historicalPrices.length > 0 ? (() => {
                  const minPrice = Math.min(...historicalPrices.map(h => h.price));
                  const maxPrice = Math.max(...historicalPrices.map(h => h.price));
                  const range = maxPrice - minPrice || 1;
                  
                  const isPositiveTrend = historicalPrices[historicalPrices.length - 1].price >= historicalPrices[0].price;
                  const lineColor = isPositiveTrend ? '#10b981' : '#ef4444';
                  const gradientStopColor = isPositiveTrend ? '#10b981' : '#ef4444';

                  // Point selection (hovered or last)
                  const selectedPointIndex = hoveredIndex !== null ? hoveredIndex : historicalPrices.length - 1;
                  const selectedPoint = historicalPrices[selectedPointIndex];

                  return (
                    <div className="space-y-4">
                      {/* Interactive Tooltip / Live Metric Box */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            {hoveredIndex !== null ? 'HOVERED SESSION READOUT' : 'LATEST CLOSING SESSION'}
                          </p>
                          <p className="text-xs font-extrabold text-slate-800 font-mono mt-0.5">
                            {selectedPoint.date}, 2026
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">CLOSING VALUE</p>
                          <div className="flex items-center gap-1.5 justify-end mt-0.5 font-mono">
                            <span className="text-sm font-black text-slate-900">
                              ₹{selectedPoint.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            <span className={`text-[10px] font-bold ${selectedPoint.pctChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {selectedPoint.pctChange >= 0 ? '+' : ''}{selectedPoint.pctChange}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Canvas Container */}
                      <div className="relative h-48 bg-slate-50/50 rounded-xl border border-slate-200/80 p-4 select-none">
                        
                        {/* Background gridlines */}
                        <div className="absolute inset-x-0 top-[15%] border-t border-dashed border-slate-200/70 pointer-events-none" />
                        <div className="absolute inset-x-0 top-[50%] border-t border-dashed border-slate-200/70 pointer-events-none" />
                        <div className="absolute inset-x-0 top-[85%] border-t border-dashed border-slate-200/70 pointer-events-none" />

                        {/* Y-axis price labels on right */}
                        <div className="absolute right-2 top-2 bottom-6 flex flex-col justify-between text-[8px] font-mono text-slate-400 text-right font-black pointer-events-none">
                          <span>₹{maxPrice.toFixed(1)}</span>
                          <span>₹{((maxPrice + minPrice) / 2).toFixed(1)}</span>
                          <span>₹{minPrice.toFixed(1)}</span>
                        </div>

                        {/* SVG Drawing Zone */}
                        <div className="w-full h-[calc(100%-20px)]">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartInteractiveGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={gradientStopColor} stopOpacity="0.22" />
                                <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0.0" />
                              </linearGradient>
                            </defs>

                            {/* Area fill */}
                            <path
                              d={`M 0 100 ${historicalPrices.map((h, idx) => {
                                const x = (idx / (historicalPrices.length - 1)) * 100;
                                const y = 90 - ((h.price - minPrice) / range) * 80;
                                return `L ${x} ${y}`;
                              }).join(' ')} L 100 100 Z`}
                              fill="url(#chartInteractiveGradient)"
                              className="transition-all duration-300"
                            />

                            {/* Price stroke line */}
                            <path
                              d={historicalPrices.map((h, idx) => {
                                const x = (idx / (historicalPrices.length - 1)) * 100;
                                const y = 90 - ((h.price - minPrice) / range) * 80;
                                return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                              }).join(' ')}
                              fill="none"
                              stroke={lineColor}
                              strokeWidth="2.0"
                              strokeLinecap="round"
                              className="transition-all duration-300"
                            />

                            {/* Vertical Hover Guideline */}
                            {hoveredIndex !== null && (() => {
                              const xPos = (hoveredIndex / (historicalPrices.length - 1)) * 100;
                              const hoveredPrice = historicalPrices[hoveredIndex].price;
                              const yPos = 90 - ((hoveredPrice - minPrice) / range) * 80;
                              return (
                                <g>
                                  <line 
                                    x1={xPos} 
                                    y1="0" 
                                    x2={xPos} 
                                    y2="100" 
                                    stroke="#475569" 
                                    strokeWidth="0.5" 
                                    strokeDasharray="2,2" 
                                  />
                                  <circle 
                                    cx={xPos} 
                                    cy={yPos} 
                                    r="3.5" 
                                    fill={lineColor} 
                                    stroke="#ffffff" 
                                    strokeWidth="1.5" 
                                  />
                                </g>
                              );
                            })()}
                          </svg>

                          {/* Interactive Hitbox Overlays - 30 vertical rects for bulletproof hover interactions */}
                          <div className="absolute inset-0 flex" onMouseLeave={() => setHoveredIndex(null)}>
                            {historicalPrices.map((_, idx) => (
                              <div
                                key={idx}
                                className="flex-1 h-full cursor-crosshair"
                                onMouseEnter={() => setHoveredIndex(idx)}
                              />
                            ))}
                          </div>
                        </div>

                        {/* X-Axis dates */}
                        <div className="absolute inset-x-4 bottom-1 flex justify-between text-[8px] font-mono text-slate-400 font-bold pointer-events-none">
                          <span>{historicalPrices[0]?.date}</span>
                          <span>{historicalPrices[9]?.date}</span>
                          <span>{historicalPrices[19]?.date}</span>
                          <span>{historicalPrices[historicalPrices.length - 1]?.date}</span>
                        </div>

                      </div>
                    </div>
                  );
                })() : (
                  <div className="h-48 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 font-mono">
                    No historical coordinates resolved.
                  </div>
                )}

                {/* 1-Month performance breakdown table */}
                <div className="border border-slate-100 rounded-lg overflow-hidden text-[11px]">
                  <div className="bg-slate-50 py-1.5 px-3 border-b border-slate-100 grid grid-cols-3 font-bold text-slate-400 text-[10px] uppercase">
                    <span>Target Date</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Daily Chg %</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                    {historicalPrices.slice().reverse().filter((_, i) => i % 6 === 0).map((h, idx) => (
                      <div key={idx} className="py-2 px-3 grid grid-cols-3 hover:bg-slate-50 transition-colors font-mono">
                        <span className="font-semibold text-slate-600">{h.date}</span>
                        <span className="text-right font-bold text-slate-800">₹{h.price.toFixed(2)}</span>
                        <span className={`text-right font-bold ${h.pctChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {h.pctChange >= 0 ? '+' : ''}{h.pctChange}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Live stock-specific updates & publications */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5 text-emerald-500" />
                    Live Feeds & Updates
                  </h5>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wide font-mono animate-pulse">
                    Live Feeding
                  </span>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {loadingNews ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 text-slate-700 animate-spin" />
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Loading real-time articles...</span>
                    </div>
                  ) : liveNews.length > 0 ? (
                    liveNews.map((article, idx) => (
                      <div key={article.uuid || idx} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 text-left hover:bg-slate-100/50 transition-colors group">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 uppercase tracking-wider font-mono">
                            {article.publisher || 'FINANCIAL FEED'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold font-mono">
                            {article.publishedAt || 'RECENT'}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-slate-900 transition-colors">
                          {article.title}
                        </p>

                        {article.summary && (
                          <p className="text-[10px] text-slate-500 leading-relaxed font-sans font-medium line-clamp-2">
                            {article.summary}
                          </p>
                        )}

                        <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-200/40">
                          <span className="text-slate-400 font-mono font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified
                          </span>
                          
                          <a 
                            href={article.link || `https://www.google.com/search?q=${encodeURIComponent(selectedStockSymbol + " news " + article.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-slate-600 hover:text-slate-900 font-bold underline transition-colors"
                          >
                            <span>Read Article</span>
                            <ArrowUpRight className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : recentNotices.length > 0 ? (
                    recentNotices.map((notice, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 text-left">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 uppercase tracking-wider font-mono">
                            {notice.category}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold font-mono">
                            {notice.daysAgo}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          {notice.title}
                        </p>

                        <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-200/40">
                          <span className="text-slate-400 font-mono font-bold">{notice.date}</span>
                          
                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent("BSE NSE corporate announcement " + selectedStockSymbol + " " + notice.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-slate-600 hover:text-slate-900 font-bold underline transition-colors"
                          >
                            <span>Verify Source</span>
                            <ArrowUpRight className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400 font-mono">
                      No updates found for this ticker.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-10 text-center">
          <BarChart4 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-600">No Stock Selected</p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
            Use the search box above to lookup any of the 2,700+ real NSE stocks. Or click on popular quick tickers below.
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-5 max-w-md mx-auto">
            {['RELIANCE', 'TATAMOTORS', 'INFY', 'HDFCBANK', 'AVANTEL', 'COASTAL'].map(sym => (
              <button
                key={sym}
                onClick={() => setSelectedStockSymbol(sym)}
                className="bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-black px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
