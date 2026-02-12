import React, { useState } from 'react';
import { Session, User, SessionStatus } from '../types';
import { ICONS, GROUP_THEMES, VR_ENVIRONMENTS, VR_MODULES } from '../constants';
import HotRing from './HotRing';

interface DashboardProps {
  user: User;
  sessions: Session[];
  onJoinSession: (session: Session) => void;
  onCreateSession: (session: Omit<Session, 'id' | 'therapistName' | 'status' | 'isEncrypted'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, sessions, onJoinSession, onCreateSession }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionType, setSessionType] = useState<'individual' | 'group' | 'vr'>('individual');
  const [formData, setFormData] = useState({
    patientName: '',
    startTime: '',
    durationMinutes: 60,
    notes: '',
    themeSlug: 'student-stress',
    vrEnvironmentId: 'therapy_forest',
    selectedModules: ['thought_record', 'grounding']
  });

  const calculateEarnings = () => {
    const totalRevenue = sessions.reduce((acc, s) => {
      if (s.isGroup) return acc + (s.currentParticipants || 0) * 499;
      if (s.isVR) return acc + 2499; // Premium for VR
      return acc + 1499;
    }, 0);
    const therapistPayout = Math.floor(totalRevenue * 0.60);
    return { totalRevenue, therapistPayout };
  };

  const { totalRevenue, therapistPayout } = calculateEarnings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isGroup = sessionType === 'group';
    const isVR = sessionType === 'vr';
    
    const selectedTheme = isGroup ? GROUP_THEMES.find(t => t.slug === formData.themeSlug) : undefined;
    const selectedVREnv = isVR ? VR_ENVIRONMENTS.find(e => e.id === formData.vrEnvironmentId) : undefined;

    const sessionStartTime = formData.startTime 
      ? new Date(formData.startTime).toISOString() 
      : new Date().toISOString();

    onCreateSession({
      patientName: isGroup ? undefined : formData.patientName,
      startTime: sessionStartTime,
      durationMinutes: Number(formData.durationMinutes),
      notes: formData.notes || undefined,
      isGroup: isGroup,
      isVR: isVR,
      vrEnvironment: selectedVREnv,
      modules_planned: isVR ? formData.selectedModules : undefined,
      theme: isGroup ? {
        ...selectedTheme,
        social_proof_stat: '78% found new direction within 3 months',
        social_proof_icon: '💚'
      } : undefined,
      currentParticipants: isGroup ? 1 : undefined, 
      maxParticipants: isGroup ? 15 : undefined
    } as any);
    
    setIsModalOpen(false);
    setFormData({ 
      patientName: '', 
      startTime: '', 
      durationMinutes: 60, 
      notes: '', 
      themeSlug: 'student-stress', 
      vrEnvironmentId: 'therapy_forest',
      selectedModules: ['thought_record', 'grounding']
    });
  };

  const groupSessions = sessions.filter(s => s.isGroup);
  const individualSessions = sessions.filter(s => !s.isGroup);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0066ff] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">M</div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">MANAS360 PORTAL</h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.name}</span>
                 <div className="flex text-yellow-500 text-[10px]">{'★'.repeat(5)}</div>
                 <span className="text-[9px] font-bold text-slate-400">(42 Sessions)</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0066ff] hover:brightness-110 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/20"
          >
            New Session +
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">🔥 Group Vibes - Drop-in</h2>
                      <p className="text-[10px] font-black text-[#0066ff] uppercase tracking-[0.2em] mt-1">Available Daily 6 PM - 9 PM</p>
                    </div>
                    <div className="h-0.5 flex-1 bg-slate-200/50 mx-4"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groupSessions.length > 0 ? groupSessions.map(session => {
                        const spotsLeft = (session.maxParticipants || 15) - (session.currentParticipants || 0);
                        const isCritical = spotsLeft <= 3;
                        const isImminent = new Date(session.startTime).getTime() - Date.now() < 60000;

                        return (
                          <div 
                            key={session.id} 
                            className={`bg-white p-7 rounded-[40px] border-2 transition-all cursor-pointer relative overflow-hidden group shadow-sm hover:shadow-xl ${isCritical ? 'border-red-500/30' : 'border-white'}`}
                            onClick={() => onJoinSession(session)}
                          >
                              <div className="flex items-start justify-between mb-6">
                                  <div className="z-10">
                                      <div className="flex items-center gap-3 mb-2">
                                        <span className="text-4xl filter drop-shadow-md">{session.theme?.emoji}</span>
                                        {isCritical && (
                                          <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">Critical: {spotsLeft} Left</span>
                                        )}
                                      </div>
                                      <h3 className="font-black text-slate-900 text-xl uppercase tracking-tighter leading-tight group-hover:text-[#0066ff] transition-colors">{session.theme?.name}</h3>
                                  </div>
                                  <HotRing isLive={true} size="sm" isStartingSoon={isImminent} />
                              </div>

                              <div className="bg-slate-50 p-3 rounded-2xl mb-6 flex items-center gap-2 border border-slate-100">
                                <span className="text-lg">💚</span>
                                <p className="text-[10px] font-bold text-slate-600 leading-tight">78% found new direction within 3 months</p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                      <ICONS.Users />
                                      <span>{session.currentParticipants}/{session.maxParticipants} Participants</span>
                                  </div>
                                  <button className="bg-slate-100 group-hover:bg-[#0066ff] group-hover:text-white p-2 rounded-xl transition-all">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                  </button>
                              </div>
                          </div>
                        );
                    }) : (
                        <div className="md:col-span-2 py-16 bg-white/50 border-2 border-dashed border-slate-200 rounded-[40px] text-center">
                            <ICONS.Video />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs mt-4">Awaiting Group Activation</p>
                        </div>
                    )}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter">Sessions & VR Consultations</h2>
                <div className="grid grid-cols-1 gap-4">
                    {individualSessions.map(session => (
                        <div key={session.id} className={`bg-white p-6 rounded-[40px] border transition-all flex items-center justify-between ${session.isVR ? 'border-purple-200 bg-purple-50/30' : 'border-white'} shadow-sm hover:border-[#0066ff]`}>
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${session.isVR ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-[#0066ff]'}`}>
                                    {session.isVR ? session.vrEnvironment?.icon : session.patientName?.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-black text-slate-900 uppercase tracking-tighter text-lg">{session.patientName}</h4>
                                      {session.isVR && <span className="bg-purple-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">VR Enabled</span>}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className="text-[10px] font-black text-[#0066ff] uppercase tracking-widest">{session.isVR ? `${session.vrEnvironment?.name}` : 'E2EE Locked'}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => onJoinSession(session)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-md ${session.isVR ? 'bg-purple-600 shadow-purple-600/20 text-white' : 'bg-[#0066ff] shadow-blue-600/20 text-white'}`}>
                              Enter {session.isVR ? 'VR' : 'Room'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
          </div>

          <aside className="space-y-6">
             <div className="bg-white rounded-[40px] p-8 text-slate-900 shadow-xl border border-white">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Yield Engine</h3>
                    <div className="bg-[#0066ff]/10 text-[#0066ff] p-1.5 rounded-lg">
                        <ICONS.ShieldCheck />
                    </div>
                </div>
                
                <div className="space-y-8">
                    <div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">Therapist Payout (60%)</span>
                        <h2 className="text-5xl font-black tracking-tighter text-slate-900">₹{therapistPayout.toLocaleString()}</h2>
                    </div>

                    <div className="pt-8 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Gross Revenue</span>
                            <span className="font-bold">₹{totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Platform Split (40%)</span>
                            <span className="text-red-500 font-bold">₹{(totalRevenue - therapistPayout).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bg-[#f0f7ff] p-6 rounded-[32px] border border-blue-50">
                        <p className="text-[10px] font-black text-[#0066ff] uppercase tracking-widest mb-1">Impact Insight</p>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">"VR sessions earn 60% more per hour than traditional video consultations."</p>
                        <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-[#0066ff] rounded-full" style={{ width: '92%' }}></div>
                        </div>
                    </div>
                </div>
             </div>
          </aside>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[40px] shadow-2xl max-w-lg w-full p-10 animate-[slideUp_0.4s_ease-out] max-h-[90vh] overflow-y-auto overflow-x-hidden">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 text-center">Deploy Session</h2>
              
              <div className="flex bg-[#f0f7ff] p-2 rounded-[24px] mb-8 border border-slate-100 flex-wrap gap-2">
                  <button onClick={() => setSessionType('individual')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${sessionType === 'individual' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}>Private</button>
                  <button onClick={() => setSessionType('group')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${sessionType === 'group' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}>Group</button>
                  <button onClick={() => setSessionType('vr')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${sessionType === 'vr' ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20' : 'text-slate-400'}`}>VR CBT</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {(sessionType === 'individual' || sessionType === 'vr') && (
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Patient Name</label>
                        <input required type="text" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} className="w-full bg-[#f0f7ff] border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:border-[#0066ff] outline-none transition-all placeholder:text-slate-300" placeholder="e.g. Sarah J." />
                    </div>
                )}

                {sessionType === 'group' && (
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Room Vibe</label>
                        <select value={formData.themeSlug} onChange={(e) => setFormData({...formData, themeSlug: e.target.value})} className="w-full bg-[#f0f7ff] border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:border-[#0066ff] outline-none transition-all appearance-none">
                            {GROUP_THEMES.map(t => <option key={t.slug} value={t.slug}>{t.emoji} {t.name}</option>)}
                        </select>
                    </div>
                )}

                {sessionType === 'vr' && (
                    <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">VR Environment</label>
                          <div className="grid grid-cols-2 gap-3">
                              {VR_ENVIRONMENTS.map(env => (
                                <div 
                                  key={env.id}
                                  onClick={() => setFormData({...formData, vrEnvironmentId: env.id})}
                                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${formData.vrEnvironmentId === env.id ? 'border-purple-600 bg-purple-50' : 'border-slate-100 bg-white opacity-60'}`}
                                >
                                  <span className="text-2xl">{env.icon}</span>
                                  <span className="text-[9px] font-black uppercase text-center">{env.name}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Planned Modules</label>
                          <div className="flex flex-wrap gap-2">
                             {VR_MODULES.map(mod => (
                               <button
                                 key={mod.id}
                                 type="button"
                                 onClick={() => {
                                   const next = formData.selectedModules.includes(mod.id) 
                                     ? formData.selectedModules.filter(id => id !== mod.id)
                                     : [...formData.selectedModules, mod.id];
                                   setFormData({...formData, selectedModules: next});
                                 }}
                                 className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${formData.selectedModules.includes(mod.id) ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                               >
                                 {mod.icon} {mod.name}
                               </button>
                             ))}
                          </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Start Time</label>
                      <input 
                        type="datetime-local" 
                        value={formData.startTime} 
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})} 
                        className="w-full bg-[#f0f7ff] border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-900 focus:border-[#0066ff] outline-none transition-all" 
                      />
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Duration</label>
                      <select value={formData.durationMinutes} onChange={(e) => setFormData({...formData, durationMinutes: Number(e.target.value)})} className="w-full bg-[#f0f7ff] border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-900 focus:border-[#0066ff] outline-none transition-all appearance-none">
                          <option value={60}>60 Min</option>
                          <option value={90}>90 Min</option>
                          <option value={45}>45 Min</option>
                      </select>
                  </div>
                </div>

                <button type="submit" className={`w-full hover:brightness-110 py-6 rounded-full font-black text-white text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${sessionType === 'vr' ? 'bg-purple-600 shadow-purple-600/30' : 'bg-[#0066ff] shadow-blue-600/30'}`}>
                  Activate {sessionType === 'vr' ? 'VR Immersive' : 'Room'}
                </button>
              </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;