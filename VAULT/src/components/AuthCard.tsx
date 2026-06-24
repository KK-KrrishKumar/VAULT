import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Shield, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthCardProps {
  onAuthSuccess: () => void;
}

export default function AuthCard({ onAuthSuccess }: AuthCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3D Coin tossing states
  const [tossing, setTossing] = useState(false);
  const [rotation, setRotation] = useState({ y: 0, x: 10 });
  const [height, setHeight] = useState(0);
  const [shadowScale, setShadowScale] = useState(1);
  const [shadowOpacity, setShadowOpacity] = useState(0.2);

  const triggerToss = () => {
    if (tossing) return;
    setTossing(true);

    // Spin multiple full rotations on Y axis, and slightly wobble on X axis
    const spins = 4 + Math.floor(Math.random() * 3); // 4-6 full spins
    const endY = rotation.y + spins * 360 + (Math.random() > 0.5 ? 0 : 180); // Heads or Tails face
    const endX = 10 + (Math.random() * 12 - 6); // Slight wobble on land

    setRotation({ y: endY, x: endX });
    setHeight(-90); // fly up elegantly
    setShadowScale(0.5);
    setShadowOpacity(0.05);

    // Apex and Descent
    setTimeout(() => {
      setHeight(0); // return down
      setShadowScale(1);
      setShadowOpacity(0.2);
    }, 550);

    setTimeout(() => {
      setTossing(false);
    }, 1200);
  };

  // Toss once automatically on mount to feel dynamic
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerToss();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignIn = async () => {
    triggerToss();
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure user profile metadata is saved in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Vault Member',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (dbErr) {
        console.error('Failed to update user record in Firestore:', dbErr);
      }

      onAuthSuccess();
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      // Suppress standard popup closed errors to keep the interface neat
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 text-slate-800">
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full mb-3 border border-slate-200">
          <Shield className="w-3.5 h-3.5 text-slate-600" /> SECURE TERMINAL
        </div>

        {/* 3D Gold Coin Stage replacing "Sign In to Vault" text */}
        <div className="h-32 w-full flex flex-col items-center justify-center relative mb-4">
          <motion.div
            animate={{ y: height }}
            transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
            onClick={triggerToss}
            className="relative cursor-pointer z-10"
          >
            <motion.div
              animate={{ rotateY: rotation.y, rotateX: rotation.x }}
              transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
              className="w-24 h-24 rounded-full relative flex items-center justify-center select-none"
              style={{
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #b45309 80%, #78350f 100%)',
                boxShadow: '0 15px 30px -8px rgba(180, 83, 9, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -3px 6px rgba(0, 0, 0, 0.35)'
              }}
            >
              {/* Outer milled border rim */}
              <div className="absolute inset-1 rounded-full border border-dashed border-amber-300/60 opacity-90" />
              
              {/* Inner frame */}
              <div className="absolute inset-2.5 rounded-full border border-amber-400/30" />

              {/* Curved Circular Text: SIGN IN TO VAULT */}
              {/* Front side text path */}
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}>
                <svg className="w-full h-full rotate-[-90deg] overflow-visible" viewBox="0 0 100 100">
                  <path id="frontCirclePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  <text className="text-[7px] font-black uppercase tracking-[0.11em] fill-amber-100 font-serif">
                    <textPath href="#frontCirclePath" startOffset="50%" textAnchor="middle">
                      • SIGN IN TO VAULT •
                    </textPath>
                  </text>
                </svg>
                {/* Big elegant bold serif V or key in the center of front */}
                <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-black font-serif translate-y-[1px]">
                  V
                </div>
              </div>

              {/* Back side text path */}
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}>
                <svg className="w-full h-full rotate-[-90deg] overflow-visible" viewBox="0 0 100 100">
                  <path id="backCirclePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  <text className="text-[7px] font-black uppercase tracking-[0.11em] fill-amber-100 font-serif">
                    <textPath href="#backCirclePath" startOffset="50%" textAnchor="middle">
                      • SECURE ENTRY •
                    </textPath>
                  </text>
                </svg>
                {/* Secure Shield emblem in center of back */}
                <div className="absolute inset-0 flex items-center justify-center text-amber-200">
                  <Shield className="w-8 h-8 stroke-[2.5]" style={{ filter: 'drop-shadow(1.5px 1.5px 0px rgba(120, 53, 15, 0.95))' }} />
                </div>
              </div>

            </motion.div>
          </motion.div>

          {/* Dynamic scaling shadow beneath the coin */}
          <motion.div
            animate={{ scale: shadowScale, opacity: shadowOpacity }}
            transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
            className="absolute bottom-1 w-14 h-2.5 bg-black rounded-full filter blur-[3px]"
          />
        </div>

        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed px-2">
          Access your personalized watchlist, direct corporate SEBI disclosures, and real-time intelligence.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs leading-relaxed font-medium">
          <span className="font-bold">⚠️ Authentication Alert:</span> {error}
        </div>
      )}

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm active:scale-98 border border-slate-950 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting to secure portal...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" width="100%" height="100%">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Sign in with Google Account</span>
          </>
        )}
      </button>

      <p className="text-[10px] text-slate-400 text-center mt-5 leading-relaxed">
        By signing in, you connect securely via official authentication protocols. Authorized credentials are not shared.
      </p>
    </div>
  );
}
