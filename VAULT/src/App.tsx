import React, { useState, useEffect, useRef } from 'react';
import { 
  auth, 
  db, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

import { 
  Search, 
  Bell, 
  Check, 
  Plus, 
  X,
  Loader2,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
  LogOut,
  Building,
  Shield,
  Layers,
  Smartphone,
  ArrowRight,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

import AuthCard from './components/AuthCard';
import ScreenerSection from './components/ScreenerSection';
import AlertsStream from './components/AlertsStream';
import LiveNewsHub from './components/LiveNewsHub';
import InteractiveVault from './components/InteractiveVault';
import { mockCompanies } from './data/mockData';
import { getSector, getDerivedMetrics } from './utils/stockUtils';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isHeaderSpinning, setIsHeaderSpinning] = useState(false);
  const vaultDialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (vaultDialRef.current && !isHeaderSpinning) {
        const angle = (window.scrollY * 0.4) % 360;
        vaultDialRef.current.style.transform = `rotate(${angle}deg)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHeaderSpinning]);

  const handleHeaderVaultClick = async () => {
    if (isHeaderSpinning) return;
    setIsHeaderSpinning(true);
    
    // Add temporary programmatic spin-once class
    if (vaultDialRef.current) {
      vaultDialRef.current.classList.add('animate-spin-once');
    }
    
    await handleDeepRefresh();
    
    setTimeout(() => {
      setIsHeaderSpinning(false);
      if (vaultDialRef.current) {
        vaultDialRef.current.classList.remove('animate-spin-once');
        const angle = (window.scrollY * 0.4) % 360;
        vaultDialRef.current.style.transform = `rotate(${angle}deg)`;
      }
    }, 1000);
  };
  const [activeTab, setActiveTab] = useState<'watchlist' | 'screener'>('watchlist');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  const [pushNotification, setPushNotification] = useState<string | null>(null);

  // Live indices & commodities data
  const [indicesData, setIndicesData] = useState<any[]>([]);
  const [loadingIndices, setLoadingIndices] = useState(false);

  // Watchlist stock expanded details for daily history (No static hashing!)
  const [expandedStockSymbol, setExpandedStockSymbol] = useState<string | null>(null);
  const [watchlistHistory, setWatchlistHistory] = useState<any[]>([]);
  const [loadingWatchlistHistory, setLoadingWatchlistHistory] = useState(false);

  // Real-time quotes for watchlist symbols
  const [watchlistQuotes, setWatchlistQuotes] = useState<Record<string, any>>({});

  // Fetch real-time quotes for saved watchlist stocks
  useEffect(() => {
    if (watchlist.length === 0) {
      setWatchlistQuotes({});
      return;
    }
    const fetchWatchlistQuotes = async () => {
      try {
        const res = await fetch(`/api/stocks/quote?symbols=${watchlist.join(',')}`);
        const data = await res.json();
        if (data.quotes) {
          setWatchlistQuotes(data.quotes);
        }
      } catch (err) {
        console.error('Failed to fetch watchlist quotes:', err);
      }
    };
    fetchWatchlistQuotes();
    const interval = setInterval(fetchWatchlistQuotes, 15000);
    return () => clearInterval(interval);
  }, [watchlist]);

  // Simulated ticker and trend for TradingView interactive preview
  const [simulatedPrice, setSimulatedPrice] = useState(384.20);
  const [simulatedTrend, setSimulatedTrend] = useState<number[]>([370, 372, 371, 375, 374, 379, 378, 381, 380, 384, 382, 385, 384, 388, 386, 389, 388, 391, 390, 392, 391, 394, 393, 394]);
  const [simulatedChange, setSimulatedChange] = useState('+1.84%');

  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedPrice(prev => {
        const delta = (Math.random() - 0.45) * 0.9;
        const next = Number((prev + delta).toFixed(2));
        setSimulatedTrend(t => [...t.slice(1), next]);
        const pct = (((next - 380.0) / 380.0) * 100).toFixed(2);
        setSimulatedChange(`${parseFloat(pct) >= 0 ? '+' : ''}${pct}%`);
        return next;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Fetch live indices on mount & interval
  useEffect(() => {
    const fetchIndices = async () => {
      setLoadingIndices(true);
      try {
        const res = await fetch('/api/indices/live');
        const data = await res.json();
        if (data.indices) {
          setIndicesData(Object.values(data.indices));
        }
      } catch (err) {
        console.error('Failed to fetch live indices:', err);
      } finally {
        setLoadingIndices(false);
      }
    };
    fetchIndices();
    const interval = setInterval(fetchIndices, 20000);
    return () => clearInterval(interval);
  }, []);

  // Triggered by the spinning Vault dial - fully refreshes all dashboard data feeds
  const handleDeepRefresh = async () => {
    // 1. Refresh indices
    try {
      const res = await fetch('/api/indices/live');
      const data = await res.json();
      if (data.indices) {
        setIndicesData(Object.values(data.indices));
      }
    } catch (err) {
      console.error(err);
    }

    // 2. Refresh watchlist quotes
    if (watchlist.length > 0) {
      try {
        const res = await fetch(`/api/stocks/quote?symbols=${watchlist.join(',')}`);
        const data = await res.json();
        if (data.quotes) {
          setWatchlistQuotes(data.quotes);
        }
      } catch (err) {
        console.error(err);
      }
    }

    // 3. Trigger a temporary push alert
    setPushNotification('🔄 Secure Vault Dial Rotated: All standalone telemetry feeds & prices synchronized.');
    setTimeout(() => setPushNotification(null), 3500);
  };

  // Fetch daily historical price closes when a user expands a watchlist stock
  useEffect(() => {
    if (!expandedStockSymbol) {
      setWatchlistHistory([]);
      return;
    }
    const fetchWatchlistHistory = async () => {
      setLoadingWatchlistHistory(true);
      try {
        const res = await fetch(`/api/stocks/history?symbol=${expandedStockSymbol}`);
        const data = await res.json();
        setWatchlistHistory(data.historicalPrices || []);
      } catch (err) {
        console.error('Failed to fetch watchlist stock history:', err);
      } finally {
        setLoadingWatchlistHistory(false);
      }
    };
    fetchWatchlistHistory();
  }, [expandedStockSymbol]);

  // Track Firebase Authentication State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (!user) {
        setWatchlist([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync watchlist in real-time from Firestore when logged in
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.uid === 'demo-user') {
      const cached = localStorage.getItem('vault_demo_watchlist');
      if (cached) {
        setWatchlist(JSON.parse(cached));
      } else {
        setWatchlist(['AVANTEL', 'RELIANCE', 'TCS']);
      }
      return;
    }

    // Listen to users/{userId}/watchlist collection
    const watchlistRef = collection(db, 'users', currentUser.uid, 'watchlist');
    const unsubscribe = onSnapshot(watchlistRef, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data().symbol.toUpperCase());
      // Deduplicate and set
      setWatchlist(Array.from(new Set(items)));
    }, (error) => {
      console.error('Error syncing real-time watchlist:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Add / Remove stock from Firestore
  const handleToggleWatchlist = async (symbol: string) => {
    if (!currentUser) {
      setPushNotification('⚠️ Please log in to edit your watchlist');
      setTimeout(() => setPushNotification(null), 3000);
      return;
    }

    const cleanSymbol = symbol.trim().toUpperCase();

    if (currentUser.uid === 'demo-user') {
      let updatedWatchlist = [...watchlist];
      if (watchlist.includes(cleanSymbol)) {
        updatedWatchlist = updatedWatchlist.filter(s => s !== cleanSymbol);
        setPushNotification(`Removed ${cleanSymbol} from watchlist`);
      } else {
        updatedWatchlist.push(cleanSymbol);
        setPushNotification(`Added ${cleanSymbol} to watchlist`);
      }
      setWatchlist(updatedWatchlist);
      localStorage.setItem('vault_demo_watchlist', JSON.stringify(updatedWatchlist));
      setTimeout(() => setPushNotification(null), 3500);
      return;
    }

    const docPath = `users/${currentUser.uid}/watchlist/${cleanSymbol}`;

    try {
      if (watchlist.includes(cleanSymbol)) {
        // Remove from Firestore
        await deleteDoc(doc(db, 'users', currentUser.uid, 'watchlist', cleanSymbol));
        setPushNotification(`Removed ${cleanSymbol} from watchlist`);
      } else {
        // Save to Firestore matching custom rules schema
        await setDoc(doc(db, 'users', currentUser.uid, 'watchlist', cleanSymbol), {
          symbol: cleanSymbol,
          userId: currentUser.uid,
          addedAt: new Date().toISOString()
        });
        setPushNotification(`Added ${cleanSymbol} to watchlist`);
      }
      setTimeout(() => setPushNotification(null), 3000);
    } catch (err) {
      console.error('Watchlist Toggle Error:', err);
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  };

  const handleLogout = async () => {
    try {
      if (currentUser?.uid === 'demo-user') {
        setCurrentUser(null);
        setWatchlist([]);
        setPushNotification('Logged out from Guest session');
        setTimeout(() => setPushNotification(null), 3000);
        return;
      }
      await signOut(auth);
      setPushNotification('Signed out successfully');
      setTimeout(() => setPushNotification(null), 3000);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleDemoLogin = () => {
    setCurrentUser({
      uid: 'demo-user',
      email: 'guest@vault.com',
      displayName: 'Guest Trader'
    } as User);
    setPushNotification('Signed in as Guest Trader (Bypass Mode)');
    setTimeout(() => setPushNotification(null), 3000);
  };

  // Derive stable standalone metrics for watchlist display
  const getWatchlistStockDetails = (symbol: string) => {
    const isMocked = mockCompanies.find(c => c.symbol.toUpperCase() === symbol.toUpperCase());
    const sector = getSector(symbol);
    const metrics = getDerivedMetrics(symbol);
    
    // Prioritize real-time fetched quote for this stock
    const quote = watchlistQuotes[symbol.toUpperCase()];
    
    const price = quote ? quote.ltp : (isMocked ? isMocked.ltp : (symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1400 + 95));
    const pct = quote ? quote.chgPct : (isMocked ? isMocked.chg : Number(((symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 8) - 3.5).toFixed(2)));
    
    return { 
      price, 
      pct, 
      marketCap: metrics.marketCap, 
      pe: metrics.pe, 
      sector 
    };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">
          Loading Vault Terminal...
        </p>
      </div>
    );
  }

  // Render Logged-Out Landing & Authentication View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/80 py-4 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-extrabold text-sm tracking-tighter">
                V
              </div>
              <div>
                <h1 className="font-sans text-base font-black tracking-tight text-slate-900 uppercase">Vault</h1>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Institutional Capital Markets Terminal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg font-mono text-[10px] text-slate-600 font-bold">
              SECURE PLATFORM
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12 lg:py-16 flex flex-col items-center text-center space-y-12">
          
          {/* Landing features & details */}
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200">
              <Shield className="w-3.5 h-3.5 text-slate-700" /> Watchlist-Specific SEBI Disclosures Ticker
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                Clean, Focused <br />
                Market Intelligence.
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xl leading-relaxed font-sans font-medium mx-auto">
                Vault is a premium institutional-grade intelligence portal engineered specifically for Indian capital market participants. Establish your secure watchlist and track real-time standalone ratios, 1-month historical price dynamics, and regulatory SEBI corporate notifications without noise.
              </p>
            </div>

            {/* Real Professional Features Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full pt-4">
              <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm space-y-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-slate-700" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">100% Custom Alerts</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  No generic feeds. Receive corporate notifications & filings only for your active watchlist.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm space-y-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-slate-700" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">Screener Terminal</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Screen over 2,700+ NSE stocks, standalone balance parameters, and sector valuation metrics.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm space-y-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-slate-700" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">Verify Official Source</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Direct cross-verification links pointing straight to official exchange publications.
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Panel */}
          <div className="flex flex-col items-center justify-center w-full max-w-md">
            <AuthCard onAuthSuccess={() => {}} />
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-bold font-mono space-y-1">
          <div>VAULT CAPITAL PLATFORM • COGNIZANT PRIVACY STANDARDS • SECURED BY GOOGLE FIREBASE</div>
          <div className="text-slate-800 tracking-wider uppercase pt-1">made by <span className="font-extrabold text-slate-950">KRRISH KUMAR</span></div>
        </footer>
      </div>
    );
  }

  // Render Logged-In Application Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col pb-12">
      
      {/* Toast notifications */}
      {pushNotification && (
        <div className="fixed bottom-4 right-4 z-[100] bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-2xl border border-slate-800 flex items-center gap-2 animate-fadeIn text-xs">
          <Zap className="w-4 h-4 text-slate-300 shrink-0" />
          <span className="font-bold font-mono text-slate-100">{pushNotification}</span>
        </div>
      )}

      {/* Modern Workspace Header - Sticky with solid background */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            {/* Small Rotating Vault Dial Animation on Top */}
            <div 
              onClick={handleHeaderVaultClick}
              className="relative w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center cursor-pointer shadow-md select-none group shrink-0 active:scale-95 transition-transform"
              title="Click to spin Vault & refresh terminal rates"
            >
              {/* Outer tick marks */}
              <div className="absolute inset-0 rounded-full border border-dashed border-slate-500/30" />
              {/* Inner rotating wheel that spins on scroll & clicks */}
              <div 
                ref={vaultDialRef}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center border border-slate-600 transition-transform duration-500 ease-out"
                style={{ 
                  transform: 'rotate(0deg)' 
                }}
              >
                {/* 3 Heavy Lock Handle Bars */}
                <div className="absolute w-1 h-6 bg-slate-400 rounded-full transform rotate-0" />
                <div className="absolute w-1 h-6 bg-slate-400 rounded-full transform rotate-60" />
                <div className="absolute w-1 h-6 bg-slate-400 rounded-full transform rotate-120" />
                {/* Dial central cap */}
                <div className="absolute w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-sans text-base font-black tracking-tight text-slate-800 uppercase">Vault</h1>
                <span className="bg-slate-100 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200">
                  Terminal Active
                </span>
                <span className="bg-emerald-950 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-800 shadow-sm animate-pulse tracking-wide">
                  MADE BY KRRISH KUMAR
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold">{currentUser.displayName || currentUser.email}</p>
            </div>
          </div>

          {/* Navigation Workspace Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'watchlist' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Watchlist & Alerts</span>
            </button>
            <button
              onClick={() => setActiveTab('screener')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'screener' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Screener Terminal</span>
            </button>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-55 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Core Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8 w-full flex-1 space-y-6">
        
        {/* Real-time Global Indices & Commodities Ticker Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Indian Benchmarks */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Indian Benchmarks</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-2.5">
              {['NIFTY 50', 'SENSEX', 'NIFTY BANK'].map(name => {
                const idxData = indicesData.find(i => i.name === name);
                const positive = idxData ? idxData.positive : true;
                return (
                  <div key={name} className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">{name}</span>
                    <div className="text-right flex items-baseline gap-2 font-mono">
                      <span className="text-xs font-black text-slate-900">
                        {idxData ? idxData.value : 'Loading...'}
                      </span>
                      <span className={`text-[10px] font-bold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {idxData ? idxData.pct : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Global Markets */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Global Benchmarks</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-2.5">
              {['S&P 500', 'NASDAQ', 'FTSE 100'].map(name => {
                const idxData = indicesData.find(i => i.name === name);
                const positive = idxData ? idxData.positive : true;
                return (
                  <div key={name} className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">{name}</span>
                    <div className="text-right flex items-baseline gap-2 font-mono">
                      <span className="text-xs font-black text-slate-900">
                        {idxData ? idxData.value : 'Loading...'}
                      </span>
                      <span className={`text-[10px] font-bold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {idxData ? idxData.pct : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Global Commodities */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Real-time Commodities</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <div className="space-y-2.5">
              {['Gold', 'Silver', 'Crude Oil'].map(name => {
                const idxData = indicesData.find(i => i.name === name);
                const positive = idxData ? idxData.positive : true;
                return (
                  <div key={name} className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">{name}</span>
                    <div className="text-right flex items-baseline gap-2 font-mono">
                      <span className="text-xs font-black text-slate-900">
                        {idxData ? (name === 'Gold' || name === 'Crude Oil' ? '$' : '') + idxData.value : 'Loading...'}
                      </span>
                      <span className={`text-[10px] font-bold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {idxData ? idxData.pct : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Selected Tab content */}
        <section className="space-y-6">
          {activeTab === 'watchlist' && (
            <div className="space-y-6">
              
              {/* Main Watchlist Grid - Reclaiming the full width */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Watchlist Bento Panel - full width now */}
                <div className="lg:col-span-12 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <span>My Saved Watchlist</span>
                        <span className="bg-slate-100 text-slate-800 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-200">
                          {watchlist.length} Tickers Saved
                        </span>
                      </h3>
                      <p className="text-slate-400 text-xs">Track current price ratios and standalone parameters of your selected stocks.</p>
                    </div>

                    {/* Compact Vault Sync / Refresh Button on Side */}
                    <button
                      onClick={handleHeaderVaultClick}
                      disabled={isHeaderSpinning}
                      className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 transition-all font-sans font-bold text-[11px] cursor-pointer shadow-sm group active:scale-95 disabled:opacity-50"
                      title="Sync Watchlist Telemetry"
                    >
                      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                        <div 
                          className={`w-3.5 h-3.5 rounded-full border border-slate-400 bg-slate-100 flex items-center justify-center transition-transform duration-500 ${isHeaderSpinning ? 'rotate-360' : 'group-hover:rotate-180'}`}
                        >
                          <div className="absolute w-0.5 h-2.5 bg-slate-500 transform rotate-0" />
                          <div className="absolute w-0.5 h-2.5 bg-slate-500 transform rotate-60" />
                          <div className="absolute w-0.5 h-2.5 bg-slate-500 transform rotate-120" />
                          <div className="absolute w-1 h-1 rounded-full bg-slate-800 border border-slate-400" />
                        </div>
                      </div>
                      <span>Vault Sync</span>
                    </button>
                  </div>

                  {watchlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {watchlist.map(sym => {
                        const details = getWatchlistStockDetails(sym);
                        const isPositive = details.pct >= 0;
                        return (
                          <div 
                            key={sym}
                            onClick={() => {
                              setSelectedStockSymbol(sym);
                              setActiveTab('screener');
                            }}
                            className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm relative group"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="bg-slate-800 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded mr-1">
                                  {sym}
                                </span>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold font-mono tracking-wider">
                                  {details.sector}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleWatchlist(sym);
                                }}
                                className="text-slate-400 hover:text-red-500 font-semibold text-xs p-1"
                                title="Remove from Watchlist"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="mt-4 flex justify-between items-baseline">
                              <span className="text-lg font-extrabold text-slate-800">
                                ₹{details.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                              <span className={`text-xs font-bold font-mono ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                {isPositive ? '+' : ''}{details.pct}%
                              </span>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                              <div>
                                <span className="text-slate-400 uppercase">M.Cap:</span>
                                <span className="font-bold text-slate-700 ml-1">₹{details.marketCap} Cr</span>
                              </div>
                              <div>
                                <span className="text-slate-400 uppercase">P/E:</span>
                                <span className="font-bold text-slate-700 ml-1">{details.pe}</span>
                              </div>
                            </div>

                            {/* Expanded History Segment */}
                            <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (expandedStockSymbol === sym) {
                                    setExpandedStockSymbol(null);
                                  } else {
                                    setExpandedStockSymbol(sym);
                                  }
                                }}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1 px-2.5 rounded text-[9px] uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>{expandedStockSymbol === sym ? 'Hide Daily History' : 'Show Daily History'}</span>
                                <ChevronRight className={`w-3 h-3 transition-transform ${expandedStockSymbol === sym ? 'rotate-90' : ''}`} />
                              </button>

                              {expandedStockSymbol === sym && (
                                <div className="space-y-2 pt-1.5" onClick={(e) => e.stopPropagation()}>
                                  {loadingWatchlistHistory ? (
                                    <div className="flex items-center justify-center gap-2 py-3 text-[9px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Fetching daily closes...</span>
                                    </div>
                                  ) : watchlistHistory.length > 0 ? (
                                    <div className="space-y-2">
                                      {/* Visual SVG sparkline */}
                                      {(() => {
                                        const prices = watchlistHistory.map(h => h.price);
                                        const min = Math.min(...prices);
                                        const max = Math.max(...prices);
                                        const r = max - min || 1;
                                        const lineCol = watchlistHistory[watchlistHistory.length - 1].price >= watchlistHistory[0].price ? '#10b981' : '#ef4444';
                                        return (
                                          <div className="h-10 w-full bg-white border border-slate-200/60 rounded p-1.5">
                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                              <path
                                                d={watchlistHistory.map((h, idx) => {
                                                  const x = (idx / (watchlistHistory.length - 1)) * 100;
                                                  const y = 90 - ((h.price - min) / r) * 80;
                                                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                                                }).join(' ')}
                                                fill="none"
                                                stroke={lineCol}
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                              />
                                            </svg>
                                          </div>
                                        );
                                      })()}

                                      <div className="bg-white border border-slate-200 rounded-lg max-h-32 overflow-y-auto divide-y divide-slate-100 text-[10px] font-mono text-left">
                                        {watchlistHistory.slice().reverse().map((h, idx) => (
                                          <div key={idx} className="p-1.5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                            <span className="text-slate-500 font-semibold">{h.date}</span>
                                            <span className="font-bold text-slate-800">₹{h.price.toFixed(2)}</span>
                                            <span className={`font-bold ${h.pctChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                              {h.pctChange >= 0 ? '+' : ''}{h.pctChange}%
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-[10px] text-slate-400 font-medium text-center py-2">
                                      No historical closes available.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 flex items-center gap-0.5 text-[9px] font-bold">
                              <span>Screener</span>
                              <ChevronRight className="w-3 h-3" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-lg p-10 text-center">
                      <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">Your Watchlist is Empty</p>
                      <p className="text-[10px] text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                        To track exchange filings, capex summaries, promoter trades and earnings reports, search for stocks on the global screener and add them to your watchlist.
                      </p>
                      <button
                        onClick={() => setActiveTab('screener')}
                        className="mt-4 bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                      >
                        <span>Open Screener Terminal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Live Feeds Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Alerts feed of watched stocks */}
                <AlertsStream 
                  watchlist={watchlist} 
                  userName={currentUser.displayName || currentUser.email || 'Trader'} 
                />

                {/* Aggregated Financial Live News Terminal */}
                <LiveNewsHub watchlist={watchlist} selectedSymbol={selectedStockSymbol} />
              </div>
            </div>
          )}

          {activeTab === 'screener' && (
            <ScreenerSection 
              watchlist={watchlist} 
              onToggleWatchlist={handleToggleWatchlist}
              selectedStockSymbol={selectedStockSymbol}
              setSelectedStockSymbol={setSelectedStockSymbol}
            />
          )}
        </section>

      </main>

      <footer className="w-full max-w-7xl mx-auto py-6 px-4 border-t border-slate-200 mt-8 text-center text-xs text-slate-500 font-medium">
        <p>made by <strong>KRRISH KUMAR</strong></p>
      </footer>

    </div>
  );
}
