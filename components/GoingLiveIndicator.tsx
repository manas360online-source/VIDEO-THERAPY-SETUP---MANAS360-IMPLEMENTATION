import React, { useState, useEffect } from 'react';

interface GoingLiveIndicatorProps {
  onJoin: () => void;
  sessionName: string;
  emoji?: string;
  startTime: string; // ISO string
  initialWaitlist?: number;
  incentiveAmount?: number;
}

const GoingLiveIndicator: React.FC<GoingLiveIndicatorProps> = ({ 
  onJoin, 
  sessionName, 
  emoji = '🧠',
  startTime,
  initialWaitlist = 8,
  incentiveAmount = 50
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(600); 
  const [waitingCount, setWaitingCount] = useState(initialWaitlist);
  const [showJoinedMessage, setShowJoinedMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const diff = Math.floor((new Date(startTime).getTime() - Date.now()) / 1000);
      setTimeRemaining(diff);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    const socialTimer = setInterval(() => {
      // If session is complete, stop adding people
      if (timeRemaining > 0) {
        setWaitingCount(prev => Math.min(15, prev + (Math.random() > 0.8 ? 1 : 0)));
      }
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(socialTimer);
    };
  }, [startTime, timeRemaining]);

  const formatTime = (seconds: number) => {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getUIConfig = () => {
    // Session Completed State (New)
    if (timeRemaining <= 0) {
      return {
        label: '🏁 ROOM CLOSED',
        color: '#64748b',
        glow: 'rgba(100, 116, 139, 0.2)',
        anim: 'none',
        cta: 'SESSION COMPLETED',
        urgency: 'Room is now closed',
        disabled: true,
        emoji: '🏁'
      };
    }
    
    // User Manual Overrides for last 10 minutes
    if (timeRemaining <= 120) { // 2 mins - Red
      return {
        label: '🔴 LIVE NOW',
        color: '#FF1744',
        glow: 'rgba(255, 23, 108, 0.8)',
        anim: 'urgentFlash 0.5s ease-in-out infinite',
        cta: 'JOIN NOW!',
        urgency: 'STARTING NOW!',
        disabled: false,
        emoji: '🚀'
      };
    }
    if (timeRemaining <= 360) { // 6-3 mins - Blue
      return {
        label: '⚡ FINAL MINUTES',
        color: '#00D9FF',
        glow: 'rgba(0, 217, 255, 0.6)',
        anim: 'neonPulse 1s ease-in-out infinite',
        cta: 'TAP TO JOIN',
        urgency: 'Only a few mins left!',
        disabled: false,
        emoji: '🚀'
      };
    }
    if (timeRemaining <= 600) { // 10-7 mins - Green
      return {
        label: '✨ GOING LIVE',
        color: '#39FF14',
        glow: 'rgba(57, 255, 20, 0.6)',
        anim: 'neonPulse 1.5s ease-in-out infinite',
        cta: 'TAP TO JOIN',
        urgency: `${Math.ceil(timeRemaining / 60)} mins remain`,
        disabled: false,
        emoji: '🚀'
      };
    }

    // Default > 10m - Soft Cyan
    return {
      label: '📅 COMING SOON',
      color: '#00D9FF',
      glow: 'rgba(0, 217, 255, 0.4)',
      anim: 'neonPulse 3s ease-in-out infinite',
      cta: 'JOIN WAITLIST',
      urgency: 'Starting shortly',
      disabled: false,
      emoji: '🚀'
    };
  };

  const config = getUIConfig();

  const handleJoin = () => {
    if (config.disabled) return;
    setShowJoinedMessage(true);
    setTimeout(() => {
      setShowJoinedMessage(false);
      onJoin();
    }, 2000);
  };

  return (
    <div 
      className={`relative w-full max-w-[420px] mx-auto p-1 rounded-[32px] transition-all duration-700 ${config.disabled ? 'grayscale' : ''}`}
      style={{
        background: config.disabled ? '#334155' : `linear-gradient(45deg, ${config.color}, transparent, ${config.color})`,
        backgroundSize: '200% 200%',
        boxShadow: `0 0 30px ${config.glow}, inset 0 0 15px ${config.glow}`,
        transform: isHovered && !config.disabled ? 'scale(1.03)' : 'scale(1)',
        animation: config.disabled ? 'none' : `borderGlow 2s ease-in-out infinite`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        @keyframes borderGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes neonPulse {
          0%, 100% { opacity: 1; filter: brightness(1.2); }
          50% { opacity: 0.8; filter: brightness(1); }
        }
        @keyframes urgentFlash {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.98); }
        }
        @keyframes coinBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div className="bg-[#0b0c10] rounded-[28px] p-8 flex flex-col items-center">
        
        {/* Neon Status Badge */}
        <div 
          className="mb-8 px-5 py-2 rounded-full border-2 flex items-center gap-2"
          style={{ 
            borderColor: config.color, 
            color: config.color,
            textShadow: config.disabled ? 'none' : `0 0 10px ${config.color}`,
            animation: config.anim
          }}
        >
          <span className="text-[11px] font-black tracking-[3px] uppercase">{config.label}</span>
        </div>

        {/* Room Header */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-4xl transition-all ${config.disabled ? 'opacity-30' : 'filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]'}`}>{emoji}</span>
            <h2 className={`text-2xl font-black tracking-tighter uppercase ${config.disabled ? 'text-slate-600' : 'text-white'}`}>{sessionName}</h2>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">MODERATED DAILY • 60 MINS</p>
        </div>

        {/* Incentive Box */}
        <div 
          className={`w-full relative overflow-hidden rounded-[20px] p-5 mb-8 text-left transition-all duration-500 ${config.disabled ? 'opacity-20 grayscale' : ''}`}
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            backgroundSize: '200% 200%',
            animation: config.disabled ? 'none' : 'shimmer 4s linear infinite'
          }}
        >
          <div className="absolute -top-6 -right-6 text-7xl opacity-10 pointer-events-none">💰</div>
          <div className="flex items-center gap-4 relative z-10">
            <span className="text-4xl" style={{ animation: config.disabled ? 'none' : 'coinBounce 1.5s ease-in-out infinite' }}>🪙</span>
            <div>
              <p className="text-2xl font-black text-[#1a1a2e] leading-none tracking-tighter">Get ₹{incentiveAmount}</p>
              <p className="text-[9px] font-black text-[#1a1a2e]/60 uppercase tracking-widest mt-1">IN YOUR WALLET!</p>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center gap-3">
             <span className="text-2xl">{config.disabled ? '🏁' : '⏱️'}</span>
             <span 
               className={`text-4xl font-black font-mono tracking-tighter ${config.disabled ? 'text-slate-700' : ''}`}
               style={{ 
                 color: config.disabled ? undefined : config.color, 
                 textShadow: config.disabled ? 'none' : `0 0 15px ${config.color}` 
               }}
             >
               {formatTime(timeRemaining)}
             </span>
          </div>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">{config.urgency}</p>
        </div>

        {/* Social Proof */}
        <div className="mb-8 flex items-center gap-2">
           <span className="text-xl">👥</span>
           <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
             {waitingCount} {config.disabled ? 'WAS RECENTLY JOINED' : (timeRemaining <= 0 ? 'PEOPLE INSIDE' : 'PEOPLE WAITING TO JOIN')}
           </span>
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleJoin}
          disabled={config.disabled}
          className={`w-full py-5 rounded-[20px] font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 ${config.disabled ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'text-black active:scale-95'}`}
          style={{ 
            backgroundColor: config.disabled ? undefined : config.color,
            boxShadow: config.disabled ? 'none' : `0 10px 30px ${config.glow}`,
            animation: config.anim
          }}
        >
          <span className="text-2xl">{config.emoji}</span>
          <span className="tracking-tight uppercase">{config.cta}</span>
        </button>

      </div>

      {/* Success Overlay */}
      {showJoinedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-[fadeIn_0.3s_ease-out]">
           <div className="text-center p-10 rounded-[40px] border-2" style={{ borderColor: config.color, boxShadow: `0 0 50px ${config.glow}` }}>
              <span className="text-8xl block mb-6 animate-bounce">✅</span>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">JOINED!</h3>
              <p className="text-slate-400 font-bold italic">Bounty of ₹{incentiveAmount} credited.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default GoingLiveIndicator;