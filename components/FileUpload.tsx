
import React, { useState } from 'react';
import { processProjectData } from '../services/geminiService';
import { DashboardData } from '../types';

interface FileUploadProps {
  onDashboardCreated: (data: DashboardData) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDashboardCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      try {
        const aiData = await processProjectData(content);
        
        // Fix: Add missing properties (workload, dependencies, deliverySentiment) to type 'DashboardData'
        const newDashboard: DashboardData = {
          id: `db-${Date.now()}`,
          title: `Report: ${aiData.projectName || 'New Project'}`,
          projectName: aiData.projectName || 'Unnamed Project',
          reportDate: new Date().toLocaleDateString(),
          summary: aiData.summary || '',
          overallStatus: aiData.overallStatus || 'On Track',
          health: aiData.health || { schedule: 'On Track', scope: 'On Track', quality: 'On Track', resource: 'On Track' },
          highlights: aiData.highlights || [],
          upcomingWork: aiData.upcomingWork || [],
          risks: aiData.risks || [],
          actionItems: aiData.actionItems || [],
          workload: aiData.workload || [],
          dependencies: aiData.dependencies || [],
          deliverySentiment: aiData.deliverySentiment ?? 50,
          createdAt: Date.now()
        };

        onDashboardCreated(newDashboard);
      } catch (err: any) {
        setError(err.message || "Brain failed to process context.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
          AI Powered Intelligence
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Transform Data to Clarity.</h2>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">Upload your project exports and let PM Brain generate your executive weekly dashboard in seconds.</p>
      </div>

      <div className={`relative group p-1.5 rounded-[2.5rem] transition-all duration-500 ${loading ? 'ai-border shadow-2xl scale-[1.02]' : 'bg-slate-200/50 hover:bg-slate-200 hover:scale-[1.01]'}`}>
        <div className="bg-white rounded-[2rem] p-16 text-center border border-white relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 brain-gradient opacity-[0.03] animate-pulse-glow pointer-events-none"></div>
          )}
          
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait z-10"
          />

          <div className="relative z-0">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 brain-gradient rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-24 h-24 border-[6px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Analyzing Project Neural Map</h4>
                <div className="flex gap-2 items-center justify-center">
                  <span className="text-indigo-600 text-xs font-bold animate-pulse uppercase tracking-widest">Parsing Issues</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Identifying Risks</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 brain-gradient rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">Drop Jira Export Here</p>
                <p className="text-slate-400 text-sm mt-2 font-semibold">Supports CSV, XLSX, or Google Sheets downloads</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { title: "Risk Mitigation", desc: "Brain detects blockers before they become critical issues." },
          { title: "Executive Tone", desc: "Translates complex Jira tasks into business-ready insights." },
          { title: "Smart Health", desc: "Automated RAG status mapping based on story point velocity." }
        ].map((feat, i) => (
          <div key={i} className="text-left group cursor-default">
            <div className="w-10 h-1 text-slate-200 group-hover:w-full group-hover:bg-indigo-400 transition-all duration-500 mb-4"></div>
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">{feat.title}</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
