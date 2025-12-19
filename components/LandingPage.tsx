
import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { View } from '../App';

interface LandingPageProps {
  onNavigate: (view: View) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full bg-[#F8F9FA] overflow-x-hidden">
      <Navigation onNavigate={onNavigate} />

      {/* Hero Section with Intense Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Orbs */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-30"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
          <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-[#FF9900] rounded-full blur-[160px] animate-pulse" />
          <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-[#A259FF] rounded-full blur-[200px]" />
          <div className="absolute bottom-[10%] left-[40%] w-72 h-72 bg-[#1A73E8] rounded-full blur-[140px]" />
        </div>

        {/* Floating Code Snippets (Parallax) */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none select-none"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        >
          <div className="absolute top-[25%] right-[20%] p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 font-mono text-xs text-blue-500 opacity-60 rotate-6">
            {"{ trigger: 'Calendar', action: 'Slack' }"}
          </div>
          <div className="absolute bottom-[30%] left-[15%] p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 font-mono text-xs text-purple-500 opacity-40 -rotate-12">
            {"gemini.sketchWorkflow(userPrompt)"}
          </div>
        </div>

        <div className="relative z-20 text-center max-w-5xl px-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            NOW POWERED BY GEMINI 1.5 PRO
          </div>
          <h1 className="google-sans text-6xl md:text-8xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-8">
            Build Workflows <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-[#A259FF] to-[#FF9900] animate-gradient-text">Like You Think.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop dragging boxes. Just describe your automation to Gemini and watch the workspace sketch itself in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => onNavigate('workspace')}
              className="w-full sm:w-auto bg-[#1A73E8] text-white px-12 py-6 rounded-full text-xl font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95"
            >
              Start Sketching
            </button>
            <button onClick={() => onNavigate('features')} className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-12 py-6 rounded-full text-xl font-bold hover:bg-gray-50 transition-all">
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Visual Workspace Preview Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative rounded-[64px] bg-white shadow-2xl border border-gray-100 overflow-hidden aspect-video group cursor-pointer" onClick={() => onNavigate('workspace')}>
             <div className="absolute inset-0 bg-gray-50 canvas-dots flex items-center justify-center">
                <div className="flex items-center gap-12 scale-75 md:scale-100 transition-transform group-hover:scale-110 duration-700">
                   <div className="w-[240px] h-[80px] bg-white rounded-2xl border-l-8 border-[#FF9900] shadow-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg"></div>
                      <div className="h-4 w-24 bg-gray-100 rounded"></div>
                   </div>
                   <div className="w-32 h-[2px] bg-gray-300 relative">
                      <div className="absolute right-0 -top-1 w-2 h-2 bg-gray-300 rotate-45 border-t border-r"></div>
                   </div>
                   <div className="w-[240px] h-[80px] bg-white rounded-2xl border-l-8 border-[#A259FF] shadow-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg"></div>
                      <div className="h-4 w-24 bg-gray-100 rounded"></div>
                   </div>
                </div>
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold text-xl px-8 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">Jump into the Builder</span>
             </div>
          </div>
        </div>
      </section>

      {/* Trust / Logos */}
      <section className="py-20 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-8">
           <p className="text-center text-gray-400 font-bold text-sm tracking-widest uppercase mb-12">TRUSTED BY TEAMS AT</p>
           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
              <span className="google-sans text-2xl font-bold">Google</span>
              <span className="google-sans text-2xl font-bold">Stripe</span>
              <span className="google-sans text-2xl font-bold">Linear</span>
              <span className="google-sans text-2xl font-bold">Vercel</span>
              <span className="google-sans text-2xl font-bold">Notion</span>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center text-white font-bold text-xl">W</div>
              <span className="google-sans text-2xl font-bold text-gray-800">WorkflowHub</span>
            </div>
            <p className="text-gray-500 max-w-xs leading-relaxed">The AI-native workbench that turns descriptions into production-ready automation.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><button onClick={() => onNavigate('features')} className="hover:text-[#1A73E8]">Features</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-[#1A73E8]">Pricing</button></li>
              <li><button onClick={() => onNavigate('workspace')} className="hover:text-[#1A73E8]">Sketchbook</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-[#1A73E8]">Privacy</a></li>
              <li><a href="#" className="hover:text-[#1A73E8]">Terms</a></li>
              <li><a href="#" className="hover:text-[#1A73E8]">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 pt-12 mt-12 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
           <p>&copy; 2024 WorkflowHub Inc. Designed with Material 3.</p>
           <div className="flex gap-6">
              <a href="#">Twitter</a>
              <a href="#">GitHub</a>
              <a href="#">Discord</a>
           </div>
        </div>
      </footer>
    </div>
  );
};
