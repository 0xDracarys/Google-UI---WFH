
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import { WorkflowNode, WorkflowEdge, Message } from '../types';
import { Node } from './Node';
import { Connection } from './Connection';
import { gemini } from '../services/gemini';

interface WorkspaceProps {
  onBack: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ onBack }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'n1', type: 'trigger', service: 'Google Calendar', label: 'Event Created', position: { x: 280, y: 240 }, accentColor: '#FF9900' },
    { id: 'n2', type: 'action', service: 'OpenAI', label: 'Generate Summary', position: { x: 620, y: 240 }, accentColor: '#A259FF' },
  ]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([
    { id: 'e1', source: 'n1', target: 'n2' }
  ]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', content: 'Usr message A:' },
    { role: 'assistant', content: 'Generating workflow Calendar:\n\'gpt-4 turbo\' \'gpt-3.5-turbo\' automate.' },
    { 
      role: 'assistant', 
      content: 'Generating workflow logic:\n"trigger": "OpenAI", "model": "gpt-4"\n"gpt-4-prompt": "Summarize event\ndetails.."', 
      isDrafting: true 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsGenerating(true);
    try {
      const result = await gemini.generateWorkflow(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Drafting logic...', isDrafting: true }]);
      setTimeout(() => {
        setNodes(result.workflow.nodes);
        setEdges(result.workflow.edges);
        setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: result.explanation }]);
        setIsGenerating(false);
      }, 1500);
    } catch (error) {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA]">
      <header className="absolute top-0 left-0 right-0 h-[64px] bg-white border-b border-gray-100 flex items-center justify-between px-6 z-[60]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <span className="google-sans text-[20px] font-normal text-[#3C4043]">WorkflowHub Sketchbook</span>
        </div>

        <div className="flex-1 max-w-[640px] px-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#F1F3F4] border-transparent focus:bg-white focus:shadow-md rounded-full py-2.5 pl-12 pr-4 text-[14px] transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"><ICONS.Market className="w-5 h-5" /></button>
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm ml-2">
            <img src="https://picsum.photos/id/64/32/32" alt="Profile" />
          </div>
          <button className="bg-[#1A73E8] text-white px-5 py-1.5 rounded-full text-[14px] font-medium hover:bg-blue-700 transition-all ml-4 shadow-sm">Deploy</button>
        </div>
      </header>

      <div className="flex-1 pt-[64px] flex h-full">
        <aside className="w-[340px] p-4 flex flex-col z-50">
          <div className="flex-1 bg-white rounded-[24px] sidebar-shadow flex flex-col overflow-hidden border border-gray-100">
            <div className="gemini-header-bg px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
                </div>
                <span className="google-sans font-medium text-[16px]">Gemini 1.5 Pro</span>
              </div>
              <button className="p-1 hover:bg-white/10 rounded-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    {msg.role === 'user' ? (
                      <div className="text-[#3C4043] font-medium text-[14px] pl-1">{msg.content}</div>
                    ) : (
                      <div className="flex items-start gap-2">
                         {msg.isDrafting && (
                           <div className="mt-1 w-5 h-5 bg-[#E8F0FE] rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                             <svg className="w-3 h-3 text-[#1A73E8]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
                           </div>
                         )}
                        <div className={`flex-1 p-4 rounded-[16px] text-[13px] leading-relaxed ${msg.isDrafting ? 'bg-[#E8F0FE] text-[#1A73E8]' : 'bg-[#F1F3F4] text-[#3C4043]'} whitespace-pre-line`}>
                          {msg.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-100">
                <button className="text-gray-400 hover:text-gray-600 mr-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message" 
                  className="flex-1 bg-transparent border-none outline-none text-[14px]"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="text-gray-300 hover:text-blue-500 transition-colors ml-2">
                  <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 relative overflow-hidden canvas-dots">
          <div className="absolute inset-0">
            {edges.map(edge => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              return sourceNode && targetNode && <Connection key={edge.id} source={sourceNode} target={targetNode} />;
            })}
            {nodes.map(node => <Node key={node.id} node={node} />)}
          </div>
        </main>

        <aside className="w-[380px] bg-white border-l border-gray-100 h-full p-8 flex flex-col z-50">
          <div className="flex items-center gap-4 mb-10">
            <button className="p-1 hover:bg-gray-50 rounded-full text-[#5F6368]">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h2 className="google-sans text-[22px] font-normal text-[#202124]">API Credentials</h2>
          </div>

          <div className="space-y-10 flex-1 overflow-y-auto no-scrollbar">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#5F6368] uppercase tracking-wider">Client ID</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Client ID - Client here"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[14px] focus:border-blue-500 transition-all outline-none pr-10"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#5F6368] uppercase tracking-wider">API Secret</label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="Enter your API Secret"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[14px] focus:border-blue-500 transition-all outline-none pr-10"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>

              <button className="w-full bg-[#1A73E8] text-white py-3.5 rounded-full font-semibold text-[15px] hover:bg-blue-700 transition-all shadow-md">
                Connect Account
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="google-sans text-[18px] font-normal text-[#202124]">Configuration</h3>
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[14px] text-gray-500 bg-white outline-none">
                    <option>Calendar</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                     <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="google-sans text-[18px] font-normal text-[#202124]">Calendar</h3>
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[14px] text-gray-500 bg-white outline-none">
                    <option>Event Triggered On</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                     <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
