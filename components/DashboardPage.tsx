
import React from 'react';
import { Navigation } from './Navigation';
import { View } from '../App';

export const DashboardPage: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const workflows = [
    { title: "Email Summarizer", status: "Active", lastEdited: "2 hours ago", color: "#A259FF" },
    { title: "Slack Bot Assistant", status: "Draft", lastEdited: "1 day ago", color: "#FF9900" },
    { title: "Invoice Processor", status: "Active", lastEdited: "4 days ago", color: "#1A73E8" },
  ];

  return (
    <div className="pt-24 pb-20">
      <Navigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="google-sans text-3xl font-bold text-gray-900">Your Sketches</h1>
          <button 
            onClick={() => onNavigate('workspace')}
            className="bg-[#1A73E8] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/20"
          >
            + New Sketch
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((w, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate('workspace')}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: w.color }}>{w.title[0]}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{w.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{w.status}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">Edited {w.lastEdited}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
