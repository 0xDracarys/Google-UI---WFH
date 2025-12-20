
import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { View } from '../App';
import { gemini } from '../services/gemini';

interface LandingPageProps {
  onNavigate: (view: View) => void;
}

const HeroVisual = ({ prompt }: { prompt: string }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    gemini.generateProjectImage(prompt).then(setImgUrl);
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-[48px] bg-gray-50 overflow-hidden border border-gray-100 shadow-2xl group">
      {imgUrl ? (
        <img src={imgUrl} alt="Hero" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full bg-white overflow-x-hidden min-h-screen">
      <Navigation onNavigate={onNavigate} />

      {/* Ultra Minimal Hero */}
      <section className="pt-48 pb-32 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-100 px-6 py-2 rounded-full text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-12 animate-fade-in">
             Architecting the future of n8n
          </div>
          <h1 className="google-sans text-7xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-12">
            Sketch your logic. <br />
            <span className="text-blue-600">Deploy the rest.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium mb-20 max-w-3xl mx-auto leading-relaxed">
            The world's first conversational automation workbench. Turn high-level thoughts into production-ready blueprints in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-32">
            <button onClick={() => onNavigate('workspace')} className="w-full sm:w-auto bg-[#1A73E8] text-white px-16 py-8 rounded-[32px] text-2xl font-black hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 hover:-translate-y-1">Launch Sketchbook</button>
            <button onClick={() => onNavigate('features')} className="w-full sm:w-auto bg-white text-gray-900 border border-gray-200 px-16 py-8 rounded-[32px] text-2xl font-black hover:bg-gray-50 transition-all">Case Studies</button>
          </div>

          <div className="max-w-5xl mx-auto">
            <HeroVisual prompt="High-end data visualization dashboard, isometric automation flow, blue and purple lighting, sleek interface, dark background" />
          </div>
        </div>
      </section>

      {/* Simple Feature Ticker */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-between gap-12 text-center md:text-left">
          {[
            { label: "Architecture", value: "Generative" },
            { label: "Deployment", value: "n8n Native" },
            { label: "Security", value: "Vaulted Keys" },
            { label: "Engine", value: "Gemini 3 Pro" }
          ].map((item, i) => (
            <div key={i} className="flex-1 min-w-[200px]">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{item.label}</div>
              <div className="text-3xl font-black text-gray-900 tracking-tighter">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-20 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="google-sans text-2xl font-black text-gray-900">WorkflowHub</div>
           <div className="flex gap-12 text-sm font-bold text-gray-400">
             <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Status</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Enterprise</a>
           </div>
           <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">© 2025 Architectural Units</div>
        </div>
      </footer>
    </div>
  );
};
