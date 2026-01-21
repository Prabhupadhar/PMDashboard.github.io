
import React from 'react';
import { DashboardData } from '../types';

interface SavedListProps {
  items: DashboardData[];
  onView: (data: DashboardData) => void;
  onDelete: (id: string) => void;
}

const SavedList: React.FC<SavedListProps> = ({ items, onView, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
        </div>
        <p className="text-xl font-black text-slate-900 tracking-tight">Intelligence Folder is Empty</p>
        <p className="text-slate-500 font-medium text-sm mt-1">Start by uploading project data to generate insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Brain Folder</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Stored Dashboard Archives</p>
        </div>
        <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black tracking-widest uppercase">
          {items.length} Reports Stored
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.id} className="group bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-3 h-3 rounded-full ${
                  item.overallStatus === 'On Track' ? 'bg-emerald-500' :
                  item.overallStatus === 'At Risk' ? 'bg-amber-500' : 'bg-rose-500'
                }`}></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.reportDate}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">{item.projectName}</h3>
              <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed opacity-70">
                {item.summary || 'Summary captured by AI analysis of project data and task velocity.'}
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={() => onView(item)}
                className="flex-1 brain-gradient text-white text-xs font-black py-3 rounded-xl uppercase tracking-widest shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200 transition-all"
              >
                Recall Intelligence
              </button>
              <button 
                onClick={() => onDelete(item.id)}
                className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedList;
