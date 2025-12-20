
import React from 'react';
import { Navigation } from './Navigation';
import { View } from '../App';
import { ICONS } from '../constants';

export const PricingPage: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const plans = [
    { 
      name: "Personal", 
      price: "$0", 
      features: ["3 Active Sketches", "Gemini 1.5 Flash", "Community Support", "Basic Connectors"], 
      cta: "Start Free", 
      popular: false 
    },
    { 
      name: "Pro", 
      price: "$29", 
      features: ["Unlimited Sketches", "Gemini 1.5 Pro", "Priority Support", "Custom JS Nodes", "API Webhooks"], 
      cta: "Get Started", 
      popular: true 
    },
    { 
      name: "Enterprise", 
      price: "Custom", 
      features: ["SAML SSO", "On-prem options", "Dedicated AI Training", "Audit Logs", "24/7 Support"], 
      cta: "Contact Sales", 
      popular: false 
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <Navigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="google-sans text-6xl font-black text-[#202124] mb-6 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-500 font-medium">Pick the plan that fits your automation needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <div 
              key={i} 
              className={`relative p-12 rounded-[48px] border transition-all duration-500 hover:shadow-2xl ${
                p.popular 
                  ? 'border-[#1A73E8] bg-white ring-1 ring-[#1A73E8] scale-105 z-10' 
                  : 'border-gray-100 bg-white'
              } flex flex-col`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1A73E8] text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="google-sans text-3xl font-black text-[#202124] mb-12">{p.name}</h3>
              
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-5xl font-black text-[#202124] tracking-tighter">
                  {p.price === 'Custom' ? '' : p.price}
                </span>
                {p.price === 'Custom' ? (
                  <span className="text-5xl font-black text-[#202124] tracking-tighter">Custom</span>
                ) : (
                  <span className="text-xl text-gray-400 font-bold">/mo</span>
                )}
              </div>
              
              <ul className="space-y-6 mb-16 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-4 text-gray-600 text-sm font-bold">
                    <ICONS.Checkmark className="w-5 h-5 text-[#1A73E8] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => onNavigate('workspace')} 
                className={`w-full py-5 rounded-full font-black text-lg transition-all active:scale-95 ${
                  p.popular 
                    ? 'bg-[#1A73E8] text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700' 
                    : 'bg-[#F1F3F4] text-[#202124] hover:bg-gray-200'
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
