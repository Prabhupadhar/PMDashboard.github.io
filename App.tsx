
import React, { useState, useEffect } from 'react';
import { User, DashboardData } from './types';
import Login from './components/Login';
import DashboardView from './components/DashboardView';
import Sidebar from './components/Sidebar';
import SavedList from './components/SavedList';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'saved' | 'current'>('upload');
  const [currentDashboard, setCurrentDashboard] = useState<DashboardData | null>(null);
  const [savedDashboards, setSavedDashboards] = useState<DashboardData[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('pm_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedReports = localStorage.getItem('pm_reports');
    if (storedReports) setSavedDashboards(JSON.parse(storedReports));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('pm_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pm_user');
  };

  const handleDashboardCreated = (data: DashboardData) => {
    setCurrentDashboard(data);
    setActiveTab('current');
  };

  const handleSaveDashboard = (data: DashboardData) => {
    const updated = [data, ...savedDashboards.filter(d => d.id !== data.id)];
    setSavedDashboards(updated);
    localStorage.setItem('pm_reports', JSON.stringify(updated));
    alert('Dashboard saved to folder!');
  };

  const handleViewSaved = (data: DashboardData) => {
    setCurrentDashboard(data);
    setActiveTab('current');
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedDashboards.filter(d => d.id !== id);
    setSavedDashboards(updated);
    localStorage.setItem('pm_reports', JSON.stringify(updated));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        user={user}
      />
      
      <main className="flex-1 overflow-y-auto h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'upload' && (
            <FileUpload onDashboardCreated={handleDashboardCreated} />
          )}

          {activeTab === 'saved' && (
            <SavedList 
              items={savedDashboards} 
              onView={handleViewSaved} 
              onDelete={handleDeleteSaved} 
            />
          )}

          {activeTab === 'current' && currentDashboard ? (
            <DashboardView 
              data={currentDashboard} 
              onSave={handleSaveDashboard} 
              onUpdate={setCurrentDashboard}
            />
          ) : activeTab === 'current' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
              <p className="text-xl">No active report generated yet.</p>
              <button 
                onClick={() => setActiveTab('upload')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Upload Data Now
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
