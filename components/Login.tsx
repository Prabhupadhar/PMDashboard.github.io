
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) onLogin({ email, name });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] brain-gradient blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 blur-[150px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex w-16 h-16 brain-gradient rounded-2xl items-center justify-center mb-6 shadow-2xl shadow-indigo-500/40">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">PM BRAIN</h1>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase opacity-60">Status Intelligence Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-medium placeholder:text-slate-500 focus:bg-white/10 focus:border-indigo-500 transition-all outline-none"
                placeholder="Manager Name"
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-medium placeholder:text-slate-500 focus:bg-white/10 focus:border-indigo-500 transition-all outline-none"
                placeholder="Work Email"
              />
            </div>
            <button
              type="submit"
              className="w-full brain-gradient text-white font-black py-4 rounded-xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all tracking-widest uppercase text-xs"
            >
              Access Intelligence
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
            The manual era of status reporting is over.<br/>
            Powered by PM Brain Architecture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
