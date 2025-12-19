
import React from 'react';
import { View } from '../App';

interface NavigationProps {
  onNavigate: (view: View) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-[100] border-b border-gray-100 flex items-center justify-between px-8">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
        <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center text-white font-bold text-xl">W</div>
        <span className="google-sans text-xl font-medium text-gray-800">WorkflowHub</span>
      </div>
      <div className="flex items-center gap-8">
        <button onClick={() => onNavigate('features')} className="text-sm font-medium text-gray-600 hover:text-[#1A73E8] transition-colors">Features</button>
        <button onClick={() => onNavigate('pricing')} className="text-sm font-medium text-gray-600 hover:text-[#1A73E8] transition-colors">Pricing</button>
        <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-gray-600 hover:text-[#1A73E8] transition-colors">My Sketches</button>
        <button 
          onClick={() => onNavigate('workspace')}
          className="bg-[#1A73E8] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
        >
          Launch Builder
        </button>
      </div>
    </nav>
  );
};
