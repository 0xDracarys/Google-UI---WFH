
import React from 'react';
import { Navigation } from './Navigation';
import { View } from '../App';

export const PricingPage: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const plans = [
    { name: "Personal", price: "Free", features: ["3 Active Sketches", "Gemini 1.5 Flash", "Community Support", "Basic Connectors"], cta: "Start Free", popular: false },
    { name: "Pro", price: "$29", features: ["Unlimited Sketches", "Gemini 1.5 Pro", "Priority Support", "Custom JS Nodes", "API Webhooks"], cta: "Get Started", popular: true },
    { name: "Enterprise", price: "Custom", features: ["SAML SSO", "On-prem options", "Dedicated AI Training", "Audit Logs", "24/7 Support"], cta: "Contact Sales", popular: false },
  ];

  return (
    <div className="pt-24 pb-20">
      <Navigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="google-sans text-5xl font-bold text-gray-900 mb-6">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-500">Pick the plan that fits your automation needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <div key={i} className={`relative p-8 rounded-[40px] border ${p.popular ? 'border-[#1A73E8] bg-blue-50/10' : 'border-gray-200 bg-white'} shadow-lg flex flex-col`}>
              {p.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1A73E8] text-white px-4 py-1 rounded-full text-xs font-bold">MOST POPULAR</span>}
              <h3 className="google-sans text-2xl font-bold text-gray-900 mb-2">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">{p.price}</span>
                {p.price !== 'Custom' && <span className="text-gray-500">/mo</span>}
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-600 text-sm">
                    <svg className="w-5 h-5 text-[#1A73E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => onNavigate('workspace')} className={`w-full py-4 rounded-full font-bold transition-all ${p.popular ? 'bg-[#1A73E8] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
