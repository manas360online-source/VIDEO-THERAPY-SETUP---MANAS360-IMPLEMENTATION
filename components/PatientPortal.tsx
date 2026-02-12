import React, { useState } from 'react';
import { GROUP_THEMES, VR_ENVIRONMENTS, VR_MODULES } from '../constants';
import GoingLiveIndicator from './GoingLiveIndicator';
import { Session, SessionStatus, VREnvironment } from '../types';

interface PatientPortalProps {
  onJoinRoom: (session: Session) => void;
  sessions: Session[];
}

const PatientPortal: React.FC<PatientPortalProps> = ({ onJoinRoom, sessions }) => {
  const [showEnvironments, setShowEnvironments] = useState(false);
  const [baseOffsetMinutes] = useState<number>(0); 

  const getThemeStartTime = (offset: number) => {
    return new Date(Date.now() + offset * 1000).toISOString();
  };

  const handleSelectRoom = (theme: any) => {
    const mockSession: Session = {
      id: `dropin-${theme.slug}-${Date.now()}`,
      therapistName: 'Certified Moderator',
      startTime: new Date().toISOString(),
      durationMinutes: 90,
      status: SessionStatus.LIVE,
      isEncrypted: true,
      isGroup: true,
      theme: {
        ...theme,
        social_proof_stat: 'Active Session',
        social_proof_icon: '🔥'
      },
      currentParticipants: Math.floor(Math.random() * 8) + 4,
      maxParticipants: 15
    };
    onJoinRoom(mockSession);
  };

  const handleLaunchVRQuickSession = (envId: string) => {
    const env = VR_ENVIRONMENTS.find(e => e.id === envId) || VR_ENVIRONMENTS[0];
    const mockSession: Session = {
      id: `vr-session-${env.id}-${Date.now()}`,
      therapistName: 'Dr. Emily Chen',
      startTime: new Date().toISOString(),
      durationMinutes: 45,
      status: SessionStatus.LIVE,
      isEncrypted: true,
      isVR: true,
      vrEnvironment: env,
      modules_planned: ['thought_record', 'exposure', 'grounding']
    };
    onJoinRoom(mockSession);
    setShowEnvironments(false);
  };

  const subRooms = GROUP_THEMES.slice(0, 6);
  const vrSessions = sessions.filter(s => s.isVR);

  return (
    <div className="min-h-screen bg-[#eef6ff] pt-12 pb-32 font-sans selection:bg-blue-500 selection:text-white flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-7xl px-6 flex flex-col items-center">
        
        {/* Header Logo & Title */}
        <header className="mb-12 flex flex-col items-center text-center animate-[fadeIn_0.5s_ease-out]">
          <div className="w-12 h-12 bg-[#0066ff] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg mb-6">M</div>
          <h1 className="text-3xl font-black text-[#1a2b4b] tracking-tight uppercase mb-2">
            MANAS360 PORTAL
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-80">
            ANONYMOUS. SECURE. PROFESSIONAL SUPPORT.
          </p>
        </header>

        {/* VR Enabled CBT Section */}
        <section className="w-full mb-20">
           <div className="flex items-center gap-6 mb-10">
              <div className="h-px flex-1 bg-purple-200"></div>
              <h2 className="text-purple-600 text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">VR Enabled CBT Sessions</h2>
              <div className="h-px flex-1 bg-purple-200"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[48px] p-10 text-white shadow-2xl shadow-purple-600/20 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform"></div>
                  <div className="z-10 relative h-full flex flex-col">
                     <span className="bg-white/20 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/30 mb-6 inline-block w-fit">Immersive Therapy</span>
                     <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Launch VR CBT</h3>
                     <p className="text-sm font-medium text-white/80 leading-relaxed mb-8">Practice CBT techniques in immersive virtual environments. 40% higher engagement vs traditional video calls.</p>
                     
                     <ul className="space-y-3 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-xs font-bold">
                           <span className="text-purple-300 italic text-lg leading-none">★</span> 3D Floating Thought Records
                        </li>
                        <li className="flex items-center gap-3 text-xs font-bold">
                           <span className="text-purple-300 italic text-lg leading-none">★</span> Virtual Forest Grounding
                        </li>
                        <li className="flex items-center gap-3 text-xs font-bold">
                           <span className="text-purple-300 italic text-lg leading-none">★</span> Real-world Exposure Simulations
                        </li>
                     </ul>

                     <div className="flex gap-4">
                        <button 
                            onClick={() => handleLaunchVRQuickSession('therapy_forest')}
                            className="bg-white text-purple-700 px-8 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <span className="text-lg">▶</span> Start Now
                        </button>
                        <button 
                            onClick={() => setShowEnvironments(true)}
                            className="bg-purple-500/30 backdrop-blur-md text-white border border-white/20 px-8 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-purple-500/50 transition-all active:scale-95"
                        >
                            Explore Environments
                        </button>
                     </div>
                  </div>
              </div>

              <div className="space-y-4">
                 {vrSessions.length > 0 ? vrSessions.map(session => (
                    <div key={session.id} className="bg-white border-2 border-purple-100 p-6 rounded-[40px] flex items-center justify-between hover:border-purple-600 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl">{session.vrEnvironment?.icon}</div>
                            <div>
                                <h4 className="font-black text-slate-800 uppercase tracking-tighter">{session.vrEnvironment?.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                   <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{session.therapistName}</span>
                                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => onJoinRoom(session)} className="bg-purple-600 text-white p-4 rounded-3xl group-hover:scale-105 transition-transform">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </button>
                    </div>
                 )) : (
                    <div className="h-full bg-white/50 border-2 border-dashed border-purple-200 rounded-[48px] flex flex-col items-center justify-center p-10 text-center">
                        <span className="text-5xl mb-4 opacity-30">🥽</span>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Active VR Sessions</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">Pick an environment from the catalog to launch a session.</p>
                        <button 
                            onClick={() => setShowEnvironments(true)}
                            className="mt-6 text-[10px] font-black uppercase text-purple-600 border-b-2 border-purple-200 pb-1 hover:border-purple-600 transition-all"
                        >
                            Open Immersive Catalog →
                        </button>
                    </div>
                 )}
              </div>
           </div>
        </section>

        {/* Main Feature Card */}
        <main className="w-full flex justify-center mb-24">
          <div className="w-full max-w-[440px] animate-[slideUp_0.6s_ease-out]">
            <GoingLiveIndicator 
              sessionName={GROUP_THEMES[0].name}
              emoji={GROUP_THEMES[0].emoji}
              startTime={getThemeStartTime(baseOffsetMinutes * 60)}
              onJoin={() => handleSelectRoom(GROUP_THEMES[0])}
              initialWaitlist={8}
              incentiveAmount={50}
            />
          </div>
        </main>

        <div className="w-full mb-12">
           <div className="flex items-center gap-6 mb-16">
              <div className="h-px flex-1 bg-slate-200"></div>
              <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">Explore Group Vibes</h2>
              <div className="h-px flex-1 bg-slate-200"></div>
           </div>
        </div>

        {/* The Grid of 6 Sections */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {subRooms.map((theme) => (
            <div 
              key={theme.id} 
              className="group bg-white rounded-[48px] p-10 shadow-2xl shadow-blue-900/5 border border-white flex flex-col items-center text-center transition-all hover:scale-[1.03] active:scale-95 cursor-pointer relative overflow-hidden"
              onClick={() => handleSelectRoom(theme)}
            >
              <div className="relative mb-8">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff1744] text-white text-[8px] font-black uppercase px-3 py-1 rounded-full border border-red-400 shadow-lg whitespace-nowrap z-10">
                   HOT NOW
                 </div>
                 <div className="w-24 h-24 bg-[#fff5f5] rounded-full flex items-center justify-center text-5xl border-2 border-red-100 shadow-[0_0_30px_rgba(255,23,68,0.1)] group-hover:shadow-[0_0_40px_rgba(255,23,68,0.2)] transition-shadow">
                   {theme.emoji}
                 </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2 group-hover:text-[#ff1744] transition-colors">
                {theme.name.split(' ')[0]} {theme.name.split(' ')[1] || ''}
              </h3>
              <div className="flex items-center gap-2 mt-4 opacity-40 group-hover:opacity-100 transition-opacity">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TAP TO JOIN</p>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#f0f7ff] rounded-full -mr-12 -mt-12 opacity-50"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Environments Overlay */}
      {showEnvironments && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white rounded-[50px] w-full max-w-6xl h-[90vh] overflow-y-auto overflow-x-hidden p-8 md:p-12 relative animate-[slideUp_0.4s_ease-out]">
                <button 
                  onClick={() => setShowEnvironments(false)}
                  className="sticky top-0 float-right w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all font-bold z-50 shadow-sm"
                >
                  ✕
                </button>

                <div className="text-center mb-16 pt-4">
                   <span className="text-[#0066ff] text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Therapy Without Walls</span>
                   <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Immersive VR Catalog</h2>
                   <p className="max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed uppercase text-[10px] tracking-widest font-black">Pre-built Environments (Launch Session)</p>
                </div>

                {/* Environments Grid - PDF Page 15 Refined */}
                <div className="pb-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {VR_ENVIRONMENTS.map(env => (
                        <div 
                            key={env.id} 
                            className="group cursor-pointer flex flex-col"
                            onClick={() => handleLaunchVRQuickSession(env.id)}
                        >
                           <div className="relative aspect-video rounded-[40px] overflow-hidden mb-5 shadow-2xl border-4 border-transparent group-hover:border-purple-600 transition-all">
                              <img src={env.thumbnail} alt={env.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Click to Launch</div>
                              <div className="absolute bottom-6 left-6 right-6">
                                 <div className="flex items-center gap-3">
                                    <span className="text-3xl bg-white/20 backdrop-blur-md p-2 rounded-2xl border border-white/30">{env.icon}</span>
                                    <div>
                                       <p className="text-white text-lg font-black uppercase tracking-tighter leading-none mb-1">{env.name}</p>
                                       <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{env.name_hi}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="px-4">
                              <div className="flex flex-wrap gap-2 mb-3">
                                 <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-600">{env.therapy_type}</span>
                                 {env.target_conditions.map(c => (
                                    <span key={c} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-500">{c}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Modules Grid */}
                <div className="mt-20 border-t border-slate-100 pt-16 mb-10">
                   <div className="flex items-center gap-4 mb-10">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Interactive CBT Modules</h3>
                      <div className="h-px flex-1 bg-slate-100"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {VR_MODULES.map(module => (
                        <div 
                            key={module.id} 
                            className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 hover:border-purple-200 transition-all group cursor-pointer"
                        >
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">{module.icon}</div>
                           <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-1">{module.name}</h4>
                           <p className="text-[9px] text-slate-500 font-bold leading-relaxed">{module.description}</p>
                        </div>
                      ))}
                   </div>
                </div>
            </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(40px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
};

export default PatientPortal;