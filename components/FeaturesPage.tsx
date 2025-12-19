
import React from 'react';
import { Navigation } from './Navigation';
import { View } from '../App';

export const FeaturesPage: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const features = [
    { title: "Generative Canvas", desc: "Type instructions like 'Connect my Gmail to Notion' and see nodes sprout instantly.", icon: "🎨" },
    { title: "Gemini Intelligence", desc: "Powered by Gemini 1.5 Pro to understand complex business logic and edge cases.", icon: "🧠" },
    { title: "Auto-Credentialing", desc: "Securely vault your keys once; Gemini handles OAuth flows and scopes automatically.", icon: "🔐" },
    { title: "Infinite Scalability", desc: "From simple 2-node tasks to massive enterprise event buses.", icon: "♾️" },
    { title: "Visual Debugging", desc: "Watch data flow through your 'sketch' in real-time with live variable tracking.", icon: "🐞" },
    { title: "Custom Transformers", desc: "Let the AI write custom JavaScript snippets for data cleaning on the fly.", icon: "⚡" },
  ];

  return (
    <div className="pt-24 pb-20">
      <Navigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="google-sans text-5xl font-bold text-gray-900 mb-6">Built for the future of work</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">WorkflowHub combines the intuition of a whiteboard with the power of a modern backend.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="google-sans text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
