
import React, { useState } from 'react';
import { DashboardData, StatusLevel, RiskItem, ActionItem } from '../types';

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
        bg: 'bg-emerald-500/10', 
        text: 'text-emerald-600', 
        border: 'border-emerald-200/50', 
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
        dot: 'bg-emerald-500'
      };
      case 'At Risk': return { 
        bg: 'bg-amber-500/10', 
        text: 'text-amber-600', 
        border: 'border-amber-200/50', 
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
        dot: 'bg-amber-500'
      };
      case 'Off Track': return { 
        bg: 'bg-rose-500/10', 
        text: 'text-rose-600', 
        border: 'border-rose-200/50', 
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
        dot: 'bg-rose-500'
      };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', glow: '', dot: 'bg-slate-400' };
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

  const copyToClipboard = () => {
    const text = `
PROJECT STATUS REPORT: ${data.projectName}
Date: ${data.reportDate}
Overall Status: ${data.overallStatus}
Summary: ${data.summary}
    `;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const overall = getStatusInfo(data.overallStatus);

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Floating Header */}
      <header className="sticky top-4 z-20 backdrop-blur-xl bg-white/80 border border-slate-200/60 p-5 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-12 rounded-full ${overall.dot} opacity-20`}></div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{data.projectName}</h1>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${overall.bg} ${overall.text}`}>
                {data.overallStatus}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Status Intelligence Report • {data.reportDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              isEditing ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            {isEditing ? 'Save Changes' : 'Customize'}
          </button>
          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
          <button onClick={copyToClipboard} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          </button>
          <button onClick={() => onSave(data)} className="brain-gradient text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-transform">
            Save Report
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Summary Card with AI Flair */}
        <section className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 brain-gradient rounded-md flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-extrabold text-slate-900 tracking-tight">AI Executive Summary</h3>
          </div>
          {isEditing ? (
            <textarea
              value={data.summary}
              onChange={(e) => handleUpdateField('summary', e.target.value)}
              className="w-full h-48 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all outline-none"
            />
          ) : (
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              {data.summary || 'Analyzing data points...'}
            </p>
          )}
        </section>

        {/* Health Indicators Card */}
        <section className="lg:col-span-4 bg-slate-950 rounded-3xl p-8 border border-white/10 shadow-xl">
          <h3 className="text-white font-extrabold mb-8 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full brain-gradient animate-pulse"></span>
            Health Metrics
          </h3>
          <div className="space-y-6">
            {(Object.keys(data.health) as Array<keyof typeof data.health>).map((key) => {
              const info = getStatusInfo(data.health[key]);
              return (
                <div key={key} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{key}</span>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${info.text}`}>{data.health[key]}</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${info.dot}`} 
                      style={{ width: data.health[key] === 'On Track' ? '100%' : data.health[key] === 'At Risk' ? '60%' : '30%' }}
                    ></div>
                  </div>
                  {isEditing && (
                    <div className="flex gap-1 mt-2 overflow-hidden rounded-lg">
                      {['On Track', 'At Risk', 'Off Track'].map((s) => (
                        <button 
                          key={s}
                          onClick={() => handleUpdateHealth(key, s as StatusLevel)}
                          className={`flex-1 py-1 text-[8px] font-bold ${data.health[key] === s ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Highlights & Upcoming - Side by Side */}
        <section className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              Key Wins
            </h3>
            {isEditing && <button onClick={() => handleUpdateField('highlights', [...data.highlights, ''])} className="text-xs font-black text-indigo-600 hover:text-indigo-700">+ ADD WIN</button>}
          </div>
          <div className="space-y-4">
            {data.highlights.map((h, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="mt-1 w-5 h-5 flex-shrink-0 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-[10px]">{i+1}</div>
                {isEditing ? (
                  <input value={h} onChange={(e) => {
                    const next = [...data.highlights]; next[i] = e.target.value; handleUpdateField('highlights', next);
                  }} className="flex-1 border-b border-slate-100 focus:border-indigo-400 outline-none pb-1 text-sm text-slate-600" />
                ) : (
                  <p className="text-slate-600 text-sm font-medium">{h}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              Milestones
            </h3>
            {isEditing && <button onClick={() => handleUpdateField('upcomingWork', [...data.upcomingWork, ''])} className="text-xs font-black text-indigo-600 hover:text-indigo-700">+ ADD NEXT</button>}
          </div>
          <div className="space-y-4">
            {data.upcomingWork.map((u, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="mt-1 w-2 h-2 flex-shrink-0 bg-indigo-400 rounded-full"></div>
                {isEditing ? (
                  <input value={u} onChange={(e) => {
                    const next = [...data.upcomingWork]; next[i] = e.target.value; handleUpdateField('upcomingWork', next);
                  }} className="flex-1 border-b border-slate-100 focus:border-indigo-400 outline-none pb-1 text-sm text-slate-600" />
                ) : (
                  <p className="text-slate-600 text-sm font-medium">{u}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Risks Heatmap */}
        <section className="lg:col-span-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              Critical Risks & Blockers
            </h3>
            {isEditing && <button onClick={() => handleUpdateField('risks', [...data.risks, { id: Date.now().toString(), description: '', severity: 'Medium', mitigation: '' }])} className="text-xs font-black text-rose-600 hover:text-rose-700">+ LOG RISK</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Description</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Severity</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Mitigation Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.risks.map((risk, idx) => (
                  <tr key={risk.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-800">{risk.description || 'New risk entry...'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        risk.severity === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        risk.severity === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {risk.severity}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-semibold text-slate-500 italic">{risk.mitigation || 'Defining strategy...'}</p>
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
