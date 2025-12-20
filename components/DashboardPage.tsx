
import React from 'react';
import { Navigation } from './Navigation';
import { View } from '../App';

export const DashboardPage: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const workflows = [
    { title: "Email Summarizer", status: "Active", lastEdited: "2 hours ago", color: "#A259FF", nodes: 4 },
    { title: "Slack Bot Assistant", status: "Draft", lastEdited: "1 day ago", color: "#FF9900", nodes: 7 },
    { title: "Invoice Processor", status: "Active", lastEdited: "4 days ago", color: "#1A73E8", nodes: 12 },
    { title: "Customer Success Sync", status: "Active", lastEdited: "1 week ago", color: "#4F46E5", nodes: 5 },
  ];

  return (
    <div className="pt-24 pb-20 bg-[#F8F9FA] min-h-screen">
      <Navigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
          <div>
            <h1 className="google-sans text-5xl font-black text-[#1A1C1E] tracking-tight mb-3">Your Sketches</h1>
            <p className="text-lg text-gray-500 font-bold">Collaborate, architect, and deploy automation blueprints.</p>
          </div>
          <button 
            onClick={() => onNavigate('workspace')}
            className="flex items-center gap-3 bg-[#1A73E8] text-white px-10 py-5 rounded-[24px] font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="text-2xl leading-none">+</span>
            New Blueprint
          </button>
        </div>

        {/* Project Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Total Sketches", value: "24", icon: "📐" },
            { label: "Production Active", value: "18", icon: "⚡" },
            { label: "AI Suggestions", value: "142", icon: "🧠" },
            { label: "Team Members", value: "8", icon: "👥" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{stat.icon}</div>
              <div>
                <div className="text-2xl font-black text-[#1A1C1E] tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workflows.map((w, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group" 
              onClick={() => onNavigate('workspace')}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: w.color }}>
                  {w.title[0]}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${w.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                  {w.status}
                </div>
              </div>

              <h3 className="google-sans text-2xl font-black text-[#1A1C1E] mb-2 group-hover:text-blue-600 transition-colors">{w.title}</h3>
              <div className="flex items-center gap-4 text-[13px] text-gray-500 font-bold">
                 <span>{w.nodes} Nodes</span>
                 <span className="w-1 h-1 bg-gray-200 rounded-full" />
                 <span>Edited {w.lastEdited}</span>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(u => (
                    <div key={u} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100" />
                  ))}
                </div>
                <button className="text-[12px] font-black text-blue-600 hover:underline">
                  Open Workspace →
                </button>
              </div>
            </div>
          ))}
          
          {/* Create New Card */}
          <div 
            className="rounded-[40px] border-4 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-blue-200 hover:bg-blue-50/20 transition-all"
            onClick={() => onNavigate('workspace')}
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl text-gray-400 mb-6 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all">+</div>
            <h4 className="text-xl font-black text-gray-500 group-hover:text-blue-600 transition-colors">Draft New Sketch</h4>
            <p className="text-sm text-gray-400 font-bold mt-2">Just start typing your logic.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
