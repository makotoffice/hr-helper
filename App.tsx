
import React, { useState, useCallback } from 'react';
import { AppTab, Participant } from './types';
import ParticipantManager from './components/ParticipantManager';
import LuckyDraw from './components/LuckyDraw';
import AutoGrouping from './components/AutoGrouping';
import { Users, Gift, ListChecks, Briefcase } from 'lucide-react';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LIST);

  const handleUpdateParticipants = useCallback((newList: Participant[]) => {
    setParticipants(newList);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Briefcase size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HR Pro Toolbox</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span>Participants: <span className="text-indigo-600">{participants.length}</span></span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          
          {/* Tabs Navigation */}
          <div className="flex bg-slate-200 p-1 rounded-xl w-fit self-center sm:self-start">
            <button
              onClick={() => setActiveTab(AppTab.LIST)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === AppTab.LIST 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListChecks size={18} />
              <span className="hidden sm:inline">名單管理</span>
            </button>
            <button
              disabled={participants.length === 0}
              onClick={() => setActiveTab(AppTab.LUCKY_DRAW)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === AppTab.LUCKY_DRAW 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gift size={18} />
              <span className="hidden sm:inline">獎品抽籤</span>
            </button>
            <button
              disabled={participants.length === 0}
              onClick={() => setActiveTab(AppTab.GROUPING)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === AppTab.GROUPING 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={18} />
              <span className="hidden sm:inline">自動分組</span>
            </button>
          </div>

          {/* Views */}
          <div className="min-h-[60vh]">
            {activeTab === AppTab.LIST && (
              <ParticipantManager 
                participants={participants} 
                onUpdate={handleUpdateParticipants} 
              />
            )}
            {activeTab === AppTab.LUCKY_DRAW && (
              <LuckyDraw participants={participants} />
            )}
            {activeTab === AppTab.GROUPING && (
              <AutoGrouping participants={participants} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} HR Pro Toolbox. Designed for efficiency.
      </footer>
    </div>
  );
};

export default App;
