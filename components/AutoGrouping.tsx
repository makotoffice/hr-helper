
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { Users, Shuffle, UserCheck, LayoutGrid, List, Download } from 'lucide-react';

interface Props {
  participants: Participant[];
}

const AutoGrouping: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const generateGroups = () => {
    if (groupSize < 1) return;
    
    // Shuffle
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      const slice = shuffled.slice(i, i + groupSize);
      newGroups.push({
        id: `group-${i}`,
        name: `第 ${newGroups.length + 1} 組`,
        members: slice
      });
    }
    
    setGroups(newGroups);
  };

  const downloadAsCSV = () => {
    if (groups.length === 0) return;

    // Define CSV headers and data
    // Added BOM for Excel UTF-8 support
    const csvContent = "\ufeff組別,姓名\n" + 
      groups.map(group => 
        group.members.map(member => `${group.name},${member.name}`).join('\n')
      ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* Configuration Bar */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Users size={24} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">每組人數</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                min="1" 
                max={participants.length}
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-20 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold text-indigo-600"
              />
              <span className="text-slate-500 font-medium">人 / 組</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              title="網格檢視"
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              title="清單檢視"
            >
              <List size={20} />
            </button>
          </div>

          <button
            onClick={generateGroups}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 transform active:scale-95"
          >
            <Shuffle size={20} />
            生成分組
          </button>

          {groups.length > 0 && (
            <button
              onClick={downloadAsCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95"
            >
              <Download size={20} />
              下載結果
            </button>
          )}
        </div>
      </section>

      {/* Results Display */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
          <Users size={64} className="opacity-20 mb-4" />
          <p className="text-lg font-medium">點擊上方按鈕開始自動分組</p>
          <p className="text-sm">將根據目前名單中的 {participants.length} 位成員進行隨機分配</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4 max-w-3xl mx-auto"
        }>
          {groups.map((group) => (
            <div 
              key={group.id} 
              className={`
                bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md
                ${viewMode === 'list' ? 'flex items-center p-4' : 'flex flex-col'}
              `}
            >
              <div className={`
                bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between
                ${viewMode === 'list' ? 'bg-transparent border-none min-w-[120px]' : ''}
              `}>
                <h3 className="font-bold text-slate-800 whitespace-nowrap">{group.name}</h3>
                <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-indigo-500 border border-indigo-100">
                  {group.members.length} 人
                </span>
              </div>
              
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1 border-l border-slate-100' : ''}`}>
                <ul className={viewMode === 'list' ? "flex flex-wrap gap-2" : "space-y-2"}>
                  {group.members.map((member) => (
                    <li 
                      key={member.id} 
                      className={`
                        flex items-center gap-2 text-sm text-slate-600
                        ${viewMode === 'list' ? 'bg-slate-100 px-3 py-1 rounded-full' : ''}
                      `}
                    >
                      <UserCheck size={14} className="text-emerald-500" />
                      <span className="font-medium">{member.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoGrouping;
