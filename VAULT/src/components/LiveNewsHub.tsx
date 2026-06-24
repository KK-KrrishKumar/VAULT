import React, { useState, useEffect } from 'react';
import { Newspaper, Search, Loader2, ArrowUpRight, TrendingUp, RefreshCw, Star, Globe2, Sparkles } from 'lucide-react';

interface Article {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: string;
  summary?: string;
}

interface LiveNewsHubProps {
  selectedSymbol?: string | null;
  watchlist?: string[];
}

export default function LiveNewsHub({ selectedSymbol, watchlist = [] }: LiveNewsHubProps) {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('Indian Stock Market');
  const [newsFilter, setNewsFilter] = useState<'market' | 'watchlist' | 'selected'>('market');

  const fetchNews = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks/news?symbol=${encodeURIComponent(query)}`);
      const data = await res.json();
      setNews(data.articles || []);
      setActiveKeyword(query);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically switch filter and load when selectedSymbol is updated
  useEffect(() => {
    if (selectedSymbol) {
      setNewsFilter('selected');
      fetchNews(selectedSymbol);
    } else {
      setNewsFilter('market');
      fetchNews('Indian Stock Market');
    }
  }, [selectedSymbol]);

  // Handle filter tab switches
  const handleFilterChange = (filter: 'market' | 'watchlist' | 'selected') => {
    setNewsFilter(filter);
    setSearchQuery('');
    
    if (filter === 'selected' && selectedSymbol) {
      fetchNews(selectedSymbol);
    } else if (filter === 'watchlist' && watchlist.length > 0) {
      // Query news for the watchlist stocks
      fetchNews(watchlist.slice(0, 3).join(' '));
    } else {
      fetchNews('Indian Stock Market');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews(searchQuery.trim());
    }
  };

  return (
    <div id="live-news-hub-container" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5 flex flex-col h-full justify-between">
      
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Newspaper className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Live Market News Terminal
              </h4>
              <p className="text-slate-400 text-[10px] font-medium uppercase font-mono tracking-wider">
                Aggregated from Moneycontrol • Economic Times • Reuters • Yahoo Finance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchNews(activeKeyword)}
              disabled={loading}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200 cursor-pointer disabled:opacity-50"
              title="Refresh feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded font-mono uppercase">
              Live Feed
            </span>
          </div>
        </div>

        {/* Dynamic News Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
          <button
            onClick={() => handleFilterChange('market')}
            className={`text-[10px] font-black px-3 py-1.5 rounded-lg border cursor-pointer transition-all flex items-center gap-1 ${
              newsFilter === 'market'
                ? 'bg-slate-900 text-white border-slate-950'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-55'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Market Feed</span>
          </button>

          {watchlist.length > 0 && (
            <button
              onClick={() => handleFilterChange('watchlist')}
              className={`text-[10px] font-black px-3 py-1.5 rounded-lg border cursor-pointer transition-all flex items-center gap-1 ${
                newsFilter === 'watchlist'
                  ? 'bg-slate-900 text-white border-slate-950'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-55'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Watchlist News</span>
            </button>
          )}

          {selectedSymbol && (
            <button
              onClick={() => handleFilterChange('selected')}
              className={`text-[10px] font-black px-3 py-1.5 rounded-lg border cursor-pointer transition-all flex items-center gap-1 ${
                newsFilter === 'selected'
                  ? 'bg-slate-900 text-white border-slate-950'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-55'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>For {selectedSymbol}</span>
            </button>
          )}
        </div>

        {/* News Keyword Search & Fast Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute inset-y-0 left-3 my-auto w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search news on ${activeKeyword}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-24 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-400 transition-all font-medium"
            />
            <button
              type="submit"
              className="absolute right-1.5 inset-y-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 rounded-lg text-[10px] uppercase transition-all cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Articles Feed */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-slate-800 animate-spin" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
              Fetching latest articles...
            </span>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
            {news.map((item) => (
              <div
                key={item.uuid}
                className="p-4 bg-slate-50 hover:bg-slate-100/50 border border-slate-200/60 rounded-xl transition-all flex flex-col justify-between gap-3 text-left group"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                      {item.publisher}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold font-mono">
                      {item.publishedAt}
                    </span>
                  </div>

                  <h5 className="text-xs font-black text-slate-800 leading-snug group-hover:text-slate-950 transition-colors">
                    {item.title}
                  </h5>

                  {item.summary && (
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 font-sans font-medium">
                      {item.summary}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/40">
                  <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase font-mono flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> Verified Source
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-black text-slate-700 hover:text-slate-900 underline transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center border border-dashed border-slate-100 rounded-xl">
            <p className="text-xs font-bold text-slate-500">No recent articles found for "{activeKeyword}"</p>
            <button
              onClick={() => handleFilterChange('market')}
              className="mt-3 text-xs font-black text-slate-800 underline uppercase cursor-pointer"
            >
              Back to main feed
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
