
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import WaitingRoom from './components/WaitingRoom';
import VideoRoom from './components/VideoRoom';
import PatientPortal from './components/PatientPortal';
import VRSessionLauncher from './components/VRSessionLauncher';
import { User, UserRole, Session, ViewState, SessionStatus, VRAccessTier } from './types';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.THERAPIST);
  const [therapistUser] = useState<User>({
    id: 'th-1',
    name: 'Dr. Emily Chen',
    role: UserRole.THERAPIST,
    avatar: 'https://picsum.photos/seed/doctor/200'
  });
  const [patientUser] = useState<User>({
    id: 'pt-1',
    name: 'Anonymous User',
    role: UserRole.PATIENT,
    avatar: 'https://picsum.photos/seed/patient/200'
  });

  const currentUser = userRole === UserRole.THERAPIST ? therapistUser : patientUser;
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 'sess-123',
      patientName: 'Sarah Johnson',
      therapistName: 'Dr. Emily Chen',
      startTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(), 
      durationMinutes: 45,
      status: SessionStatus.SCHEDULED,
      isEncrypted: true,
      notes: "Follow up on anxiety exercises."
    }
  ]);

  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const handleJoinSession = (session: Session) => {
    setActiveSession(session);
    if (session.isVR) {
      setCurrentView('VR_LAUNCHER');
    } else {
      setCurrentView(userRole === UserRole.PATIENT ? 'VIDEO_ROOM' : 'WAITING_ROOM');
    }
  };

  const handleCreateSession = (newSession: Omit<Session, 'id' | 'therapistName' | 'status' | 'isEncrypted'>) => {
    const sessionToAdd: Session = {
      ...newSession,
      id: `sess-${Math.random().toString(36).substr(2, 9)}`,
      therapistName: currentUser.name,
      status: SessionStatus.SCHEDULED,
      isEncrypted: true
    } as Session;
    setSessions(prev => [sessionToAdd, ...prev].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
  };

  const handleLaunchVR = (tier: VRAccessTier) => {
    if (activeSession) {
      setActiveSession({ ...activeSession, vrTier: tier });
      setCurrentView('VIDEO_ROOM'); 
    }
  };

  return (
    <div className="font-sans text-slate-900 min-h-screen">
      {/* Global Role Switcher */}
      <div className="fixed bottom-6 left-6 z-[60] flex gap-2 bg-white/90 backdrop-blur-xl p-1.5 rounded-full border border-blue-100 shadow-2xl">
          <button 
            onClick={() => {setUserRole(UserRole.THERAPIST); setCurrentView('DASHBOARD'); setActiveSession(null);}}
            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${userRole === UserRole.THERAPIST ? 'bg-[#0066ff] text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Therapist View
          </button>
          <button 
            onClick={() => {setUserRole(UserRole.PATIENT); setCurrentView('DASHBOARD'); setActiveSession(null);}}
            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${userRole === UserRole.PATIENT ? 'bg-[#0066ff] text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Patient View
          </button>
      </div>

      {currentView === 'DASHBOARD' && userRole === UserRole.THERAPIST && (
        <Dashboard user={currentUser} sessions={sessions} onJoinSession={handleJoinSession} onCreateSession={handleCreateSession} />
      )}

      {currentView === 'DASHBOARD' && userRole === UserRole.PATIENT && (
        <PatientPortal onJoinRoom={handleJoinSession} sessions={sessions} />
      )}

      {currentView === 'VR_LAUNCHER' && activeSession && (
        <VRSessionLauncher session={activeSession} currentUser={currentUser} onLaunch={handleLaunchVR} onBack={() => setCurrentView('DASHBOARD')} />
      )}

      {currentView === 'WAITING_ROOM' && activeSession && (
        <WaitingRoom session={activeSession} isTherapist={userRole === UserRole.THERAPIST} onAdmit={() => setCurrentView('VIDEO_ROOM')} />
      )}

      {currentView === 'VIDEO_ROOM' && activeSession && (
        <VideoRoom session={activeSession} currentUser={currentUser} onLeave={() => setCurrentView('FEEDBACK')} />
      )}

      {currentView === 'FEEDBACK' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-900/10 backdrop-blur-md p-4">
            <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0066ff]">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Session Complete</h2>
                <button onClick={() => setCurrentView('DASHBOARD')} className="mt-8 w-full py-4 bg-[#0066ff] text-white rounded-full font-black text-[10px] uppercase tracking-widest">Back to Portal</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
