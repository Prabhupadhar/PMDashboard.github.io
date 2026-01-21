
import React, { useState } from 'react';
import { DashboardData, StatusLevel, RiskItem, ActionItem, WorkloadItem, Dependency } from '../types';

interface DashboardViewProps {
  data: DashboardData;
  onSave: (data: DashboardData) => void;
  onUpdate: (data: DashboardData) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ data, onSave, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusInfo = (status: StatusLevel) => {
    switch (status) {
      case 'On Track': return { 
        bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500'
      };
      case 'At Risk': return { 
        bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500'
      };
      case 'Off Track': return { 
        bg: 'bg-rose-500/10', text: 'text-rose-600', dot: 'bg-rose-500'
      };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
    }
  };

  const handleUpdateField = (field: keyof DashboardData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleUpdateHealth = (key: keyof typeof data.health, value: StatusLevel) => {
    onUpdate({ 
      ...data, 
      health: { ...data.health, [key]: value } 
    });
  };

  const overall = getStatusInfo(data.overallStatus);

  return (
    <div className="space-y-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Floating Header */}
      <header className="sticky top-4 z-20 backdrop-blur-xl bg-white/90 border border-slate-200/60 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="w-12 h-12 rounded-2xl brain-gradient flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <span className="font-black text-xl">{data.projectName.charAt(0)}</span>
             </div>
             <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${overall.dot}`}></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{data.projectName}</h1>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${overall.bg} ${overall.text}`}>
                {data.overallStatus}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">Report v2.4 • {data.reportDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-4 px-4 border-r border-slate-100 mr-2">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sentiment</p>
                <p className="text-sm font-black text-indigo-600">{data.deliverySentiment}%</p>
             </div>
             <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full brain-gradient" style={{ width: `${data.deliverySentiment}%` }}></div>
             </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              isEditing ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {isEditing ? 'Sync Changes' : 'Customize'}
          </button>
          <button onClick={() => onSave(data)} className="brain-gradient text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">
            Save Report
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Executive Summary Card */}
        <section className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">AI Intelligence Insight</h3>
          </div>
          {isEditing ? (
            <textarea
              value={data.summary}
              onChange={(e) => handleUpdateField('summary', e.target.value)}
              className="w-full h-40 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium focus:border-indigo-500 outline-none transition-all"
            />
          ) : (
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              {data.summary || 'Crunching project data points...'}
            </p>
          )}
        </section>

        {/* Health Indicators Widget */}
        <section className="lg:col-span-4 bg-slate-950 rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">System Health</h3>
          <div className="space-y-6">
            {(Object.keys(data.health) as Array<keyof typeof data.health>).map((key) => {
              const info = getStatusInfo(data.health[key]);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 text-[10px] font-black uppercase">{key}</span>
                    <span className={`text-[9px] font-black uppercase ${info.text}`}>{data.health[key]}</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${info.dot}`} style={{ width: data.health[key] === 'On Track' ? '100%' : data.health[key] === 'At Risk' ? '60%' : '30%' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Resource Workload Widget */}
        <section className="lg:col-span-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
           <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-8">Resource Load</h3>
           <div className="space-y-5">
              {data.workload?.map((item, idx) => (
                <div key={idx} className="group">
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{item.owner.charAt(0)}</div>
                         <span className="text-xs font-bold text-slate-700">{item.owner}</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600">{item.taskCount} Tasks</span>
                   </div>
                   <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 group-hover:bg-indigo-400 transition-all" style={{ width: `${item.loadPercentage}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Dependency Map Widget */}
        <section className="lg:col-span-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
           <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-8">Dependency Map</h3>
           <div className="space-y-4">
              {data.dependencies?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No external blockers detected.</p>
              ) : (
                data.dependencies?.map((dep, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-slate-900 uppercase truncate pr-2">{dep.dependency}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                          dep.status === 'Critical' ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600'
                        }`}>{dep.status}</span>
                     </div>
                     <p className="text-[10px] text-slate-500 font-medium leading-tight">{dep.impact}</p>
                  </div>
                ))
              )}
           </div>
        </section>

        {/* Sentiment Meter Widget */}
        <section className="lg:col-span-4 bg-indigo-50 rounded-3xl p-8 border border-indigo-100 relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="font-black text-indigo-900 uppercase text-[10px] tracking-widest mb-2">Delivery Sentiment</h3>
              <p className="text-2xl font-black text-indigo-600 tracking-tighter mb-4">{data.deliverySentiment}%</p>
              <p className="text-xs text-indigo-700/70 font-medium leading-relaxed">
                The AI predicts a {data.deliverySentiment > 75 ? 'high' : 'moderate'} probability of hitting current milestone targets based on recent velocity metrics.
              </p>
           </div>
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-200/40 blur-3xl rounded-full"></div>
        </section>

        {/* Action Items Widget - Full Width */}
        <section className="lg:col-span-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">Next Week Critical Actions</h3>
            {isEditing && (
              <button 
                onClick={() => handleUpdateField('actionItems', [...data.actionItems, { id: Date.now().toString(), task: '', owner: '', dueDate: '', status: 'Open' }])}
                className="text-[10px] font-black text-indigo-600 hover:underline"
              >
                + ADD ACTION
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Task Definition</th>
                  <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                  <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                  <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.actionItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      {isEditing ? (
                        <input value={item.task} onChange={(e) => {
                          const next = [...data.actionItems]; next[idx].task = e.target.value; handleUpdateField('actionItems', next);
                        }} className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-800" />
                      ) : (
                        <p className="text-sm font-bold text-slate-800">{item.task}</p>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-semibold text-slate-500">{item.owner || 'TBD'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-slate-400 uppercase">{item.dueDate}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                        item.status === 'Blocked' ? 'bg-rose-100 text-rose-600' : 
                        item.status === 'Closed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardView;
