import React, { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Shield, Lock, Unlock, RefreshCw, Zap } from 'lucide-react';

interface InteractiveVaultProps {
  onRefresh: () => Promise<void> | void;
}

export default function InteractiveVault({ onRefresh }: InteractiveVaultProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [lastUnlockTime, setLastUnlockTime] = useState<string>('Just Now');
  const controls = useAnimation();

  const handleVaultSpin = async () => {
    if (isRotating) return;
    setIsRotating(true);
    setIsUnlocked(false);

    // Random rotation degrees (multiples of 360 + random)
    const extraDegrees = 720 + Math.floor(Math.random() * 360);
    
    // Animate rotation of the dial wheel
    await controls.start({
      rotate: extraDegrees,
      transition: { duration: 1.8, ease: "easeOut" }
    });

    // Reset rotation angle back to a relative baseline cleanly without anim animation
    controls.set({ rotate: extraDegrees % 360 });

    try {
      await onRefresh();
    } catch (err) {
      console.error(err);
    }

    setIsRotating(false);
    setIsUnlocked(true);
    setClickCount(prev => prev + 1);
    
    const now = new Date();
    setLastUnlockTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  return (
    <div id="interactive-vault-container" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700/60 rounded-xl p-5 shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* Decorative cyber grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-2 right-2 flex gap-1 font-mono text-[8px] text-emerald-400 font-bold bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mt-0.5" />
        SECURE NODE CORES
      </div>

      <div className="space-y-1.5 z-10">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h4 className="text-[11px] font-black tracking-widest text-slate-300 uppercase font-mono">
            Interactive Vault Dial
          </h4>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed font-sans font-medium">
          Rotate the high-security safe lock to synchronize standalone telemetry feeds and refresh live market data streams.
        </p>
      </div>

      {/* Main 3D Rotating Vault Wheel & Safe Mechanism */}
      <div className="flex flex-col items-center justify-center my-6 relative z-10">
        
        {/* Safe Outer Frame */}
        <div className="relative w-36 h-36 rounded-full bg-slate-950 border-4 border-slate-700/80 flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.6),_inset_0_0_15px_rgba(0,0,0,0.8)]">
          
          {/* Tick marks on outer dial */}
          {[...Array(12)].map((_, idx) => (
            <div 
              key={idx} 
              className="absolute w-1 h-2 bg-slate-600"
              style={{
                transform: `rotate(${idx * 30}deg) translateY(-60px)`
              }}
            />
          ))}

          {/* Core Rotating Dial Wheel */}
          <motion.div
            animate={controls}
            onClick={handleVaultSpin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-28 h-28 rounded-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-2xl flex items-center justify-center cursor-pointer border border-slate-600 relative group"
            style={{ transformOrigin: "center" }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
            
            {/* Circular Safe ridges */}
            <div className="w-22 h-22 rounded-full border-2 border-dashed border-slate-500/50 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-600/80 flex items-center justify-center shadow-inner relative">
                
                {/* 3 Heavy Lock Handle Bars */}
                <div className="absolute w-1.5 h-22 bg-slate-500 rounded-full transform rotate-0" />
                <div className="absolute w-1.5 h-22 bg-slate-500 rounded-full transform rotate-60" />
                <div className="absolute w-1.5 h-22 bg-slate-500 rounded-full transform rotate-120" />
                
                {/* Dial Central Caps */}
                <div className="absolute w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center z-10 shadow-lg">
                  <motion.div
                    animate={{ rotate: isRotating ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    {isUnlocked ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating helper note */}
        <p className="text-[9px] font-bold text-slate-500 mt-2.5 uppercase font-mono tracking-wider animate-bounce">
          {isRotating ? 'REFRESHING METRICS...' : 'CLICK DIAL TO SPIN & REFRESH'}
        </p>
      </div>

      {/* Vault Status Readouts */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 font-mono text-[10px] space-y-1.5 z-10">
        <div className="flex justify-between items-center text-slate-400">
          <span>SAFE INTEGRITY</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            100% SECURED
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400 border-t border-slate-800/50 pt-1">
          <span>LAST DEEP SYNC</span>
          <span className="font-bold text-slate-200">{lastUnlockTime}</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>SPINS DEPLOYED</span>
          <span className="font-bold text-slate-200">{clickCount} Cycles</span>
        </div>
      </div>

    </div>
  );
}
