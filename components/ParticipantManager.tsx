
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import { Upload, Trash2, UserPlus, FileText, ClipboardList, Users, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
}

const ParticipantManager: React.FC<Props> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');

  const simulationNames = [
    "王小明", "李美玲", "張大為", "劉德華", "陳奕迅", 
    "林志玲", "周杰倫", "蔡依林", "許瑋甯", "彭于晏",
    "郭采潔", "蕭敬騰", "田馥甄", "吳青峰", "楊丞琳",
    "羅志祥", "徐若瑄", "王心凌", "潘瑋柏", "梁靜茹"
  ];
  
  const parseNames = (text: string) => {
    const lines = text.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
    const newParticipants: Participant[] = lines.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate([...participants, ...newParticipants]);
    setInputText('');
  };

  const loadSimulationData = () => {
    const newParticipants: Participant[] = simulationNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate(newParticipants);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseNames(text);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const clearAll = () => {
    if (confirm('確定要清除所有名單嗎？')) {
      onUpdate([]);
    }
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniqueList);
  };

  // Duplicate detection logic
  const duplicateNames = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return new Set(Object.keys(counts).filter(name => counts[name] > 1));
  }, [participants]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Input Side */}
      <div className="flex flex-col gap-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="text-indigo-600" size={24} />
              <h2 className="text-lg font-semibold text-slate-800">匯入名單</h2>
            </div>
            <button
              onClick={loadSimulationData}
              className="text-xs flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors border border-amber-200 font-medium"
            >
              <Sparkles size={14} />
              載入模擬名單
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">手動貼上姓名 (以換行或逗號分隔)</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="例如: 王小明, 李大華, 張三..."
                className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              />
              <button
                onClick={() => parseNames(inputText)}
                disabled={!inputText.trim()}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <UserPlus size={18} />
                新增至名單
              </button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-medium">或</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">上傳 CSV/TXT 檔案</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500"><span className="font-semibold">點擊上傳</span> 或拖放檔案</p>
                  <p className="text-xs text-slate-400">CSV, TXT (每行一個姓名)</p>
                </div>
                <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </section>

        {participants.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-medium py-2 rounded-xl transition-colors hover:bg-red-50"
          >
            <Trash2 size={18} />
            清除所有名單
          </button>
        )}
      </div>

      {/* List Side */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="text-indigo-600" size={24} />
            <h2 className="text-lg font-semibold text-slate-800">名單預覽 ({participants.length})</h2>
          </div>
          {duplicateNames.size > 0 && (
            <button
              onClick={removeDuplicates}
              className="flex items-center gap-1.5 text-xs font-bold bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors"
            >
              <Trash2 size={14} />
              移除重複姓名 ({duplicateNames.size})
            </button>
          )}
        </div>

        {participants.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3 italic">
            <Users size={48} className="opacity-20" />
            <p>尚未匯入任何成員</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {participants.map((p) => {
                const isDuplicate = duplicateNames.has(p.name);
                return (
                  <li 
                    key={p.id}
                    className={`flex items-center justify-between bg-slate-50 p-3 rounded-xl border transition-colors group ${isDuplicate ? 'border-rose-200 bg-rose-50' : 'border-slate-100 hover:border-indigo-200'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-medium truncate ${isDuplicate ? 'text-rose-700' : 'text-slate-700'}`}>{p.name}</span>
                      {isDuplicate && (
                        <span className="flex items-center gap-1 text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                          <AlertCircle size={10} />
                          重複
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => removeParticipant(p.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default ParticipantManager;
