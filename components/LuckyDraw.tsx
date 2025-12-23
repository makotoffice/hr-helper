
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { Trophy, RotateCcw, Play, History, Settings2, Trash2 } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

interface Props {
  participants: Participant[];
}

const LuckyDraw: React.FC<Props> = ({ participants }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [currentDisplay, setCurrentDisplay] = useState<string>('???');
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [winnersHistory, setWinnersHistory] = useState<Participant[]>([]);
  const spinInterval = useRef<number | null>(null);

  const availableParticipants = allowRepeat 
    ? participants 
    : participants.filter(p => !winnersHistory.some(w => w.id === p.id));

  const startDraw = () => {
    if (availableParticipants.length === 0) {
      alert('沒有更多符合條件的參加者了！');
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    let counter = 0;
    const duration = 2000; // 2 seconds
    const intervalTime = 80;

    spinInterval.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      setCurrentDisplay(availableParticipants[randomIndex].name);
      counter += intervalTime;

      if (counter >= duration) {
        clearInterval(spinInterval.current!);
        const finalWinner = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];
        setWinner(finalWinner);
        setCurrentDisplay(finalWinner.name);
        setIsSpinning(false);
        setWinnersHistory(prev => [finalWinner, ...prev]);
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b']
        });
      }
    }, intervalTime);
  };

  const clearHistory = () => {
    setWinnersHistory([]);
    setWinner(null);
    setCurrentDisplay('???');
  };

  useEffect(() => {
    return () => {
      if (spinInterval.current) clearInterval(spinInterval.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Left: Controls & Stats */}
      <div className="lg:col-span-1 space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="text-indigo-600" size={24} />
            <h2 className="text-lg font-semibold text-slate-800">抽籤設定</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-medium text-slate-700">重複抽取</p>
                <p className="text-xs text-slate-500">允許同一人重複中獎</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={allowRepeat}
                  onChange={() => setAllowRepeat(!allowRepeat)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl">
              <p className="text-sm font-medium text-indigo-800 mb-1">抽籤池狀態</p>
              <p className="text-2xl font-bold text-indigo-600">
                {availableParticipants.length} <span className="text-sm font-normal">位成員</span>
              </p>
              {!allowRepeat && (
                <p className="text-xs text-indigo-400 mt-2 italic">
                  * 已移除 {winnersHistory.length} 位中獎者
                </p>
              )}
            </div>
          </div>
        </section>

        {winnersHistory.length > 0 && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="text-indigo-600" size={20} />
                <h2 className="text-lg font-semibold text-slate-800">中獎紀錄</h2>
              </div>
              <button onClick={clearHistory} className="text-slate-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              <ul className="space-y-2">
                {winnersHistory.map((w, idx) => (
                  <li key={`${w.id}-${idx}`} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-700 text-sm truncate font-medium">{w.name}</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                      #{winnersHistory.length - idx}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      {/* Right: The Draw Stage */}
      <div className="lg:col-span-2 flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl border border-slate-200 p-8 min-h-[500px] relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

        <div className="relative z-10 text-center space-y-12 w-full max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${winner ? 'bg-amber-100 text-amber-600 animate-bounce' : 'bg-slate-100 text-slate-400'}`}>
              <Trophy size={48} />
            </div>
            <h3 className="text-slate-400 uppercase tracking-widest font-bold text-sm">
              {isSpinning ? '抽獎中...' : winner ? '中獎者揭曉！' : '準備抽獎'}
            </h3>
          </div>

          <div className={`
            text-6xl sm:text-7xl font-black py-12 rounded-3xl transition-all duration-300
            ${isSpinning ? 'text-slate-300 scale-95 blur-[1px]' : winner ? 'text-indigo-600 scale-110 drop-shadow-md' : 'text-slate-200'}
          `}>
            {currentDisplay}
          </div>

          <div className="flex gap-4">
            <button
              onClick={startDraw}
              disabled={isSpinning || availableParticipants.length === 0}
              className={`
                flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl font-bold text-xl shadow-lg transition-all
                ${isSpinning ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200 transform hover:-translate-y-1'}
              `}
            >
              {isSpinning ? (
                <RotateCcw className="animate-spin" size={24} />
              ) : (
                <>
                  <Play fill="currentColor" size={24} />
                  點擊抽籤
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
