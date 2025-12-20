
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ICONS } from '../constants';
import { WorkflowNode, WorkflowEdge } from '../types';
import { Node } from './Node';
import { Connection } from './Connection';
import { gemini } from '../services/gemini';
import { convertSketchToN8nWorkflow, deployWorkflow } from '../services/n8n';

interface WorkspaceProps {
  onBack: () => void;
}

interface HistoryItem {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export const Workspace: React.FC<WorkspaceProps> = ({ onBack }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'n1', type: 'trigger', service: 'Google Calendar', label: 'Event Created', position: { x: 300, y: 300 }, accentColor: '#FF9900' },
    { id: 'n2', type: 'action', service: 'OpenAI', label: 'Summarize Meeting', position: { x: 700, y: 300 }, accentColor: '#A259FF' },
  ]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([
    { id: 'e1', source: 'n1', target: 'n2' }
  ]);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryItem[]>([]);
  
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [modalActiveNodeId, setModalActiveNodeId] = useState<string | null>(null);
  
  const [canvasTransform, setCanvasTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] = useState<Record<string, 'success' | 'failure' | 'running'>>({});

  const canvasRef = useRef<HTMLDivElement>(null);

  const saveToHistory = useCallback(() => {
    setHistory(prev => [...prev, { nodes: [...nodes], edges: [...edges] }]);
    setRedoStack([]);
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [{ nodes: [...nodes], edges: [...edges] }, ...prev]);
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setHistory(prev => prev.slice(0, -1));
  }, [history, nodes, edges]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory(prev => [...prev, { nodes: [...nodes], edges: [...edges] }]);
    setNodes(next.nodes);
    setEdges(next.edges);
    setRedoStack(prev => prev.slice(1));
  }, [redoStack, nodes, edges]);

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    return {
      x: (clientX - rect.left - canvasTransform.x) / canvasTransform.scale,
      y: (clientY - rect.top - canvasTransform.y) / canvasTransform.scale
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    saveToHistory();
    const query = inputValue;
    setInputValue('');
    setIsGenerating(true);

    try {
      const result = await gemini.generateWorkflow(query);
      setNodes(result.workflow.nodes);
      setEdges(result.workflow.edges);
    } catch (error) {
      console.error("Gemini failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanningCanvas(true);
    setDragOffset({
      x: e.clientX - canvasTransform.x,
      y: e.clientY - canvasTransform.y
    });
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);

    if (isDraggingNode && selectedNodeId) {
      setNodes(prev => prev.map(n => 
        n.id === selectedNodeId 
          ? { ...n, position: { x: coords.x - dragOffset.x, y: coords.y - dragOffset.y } } 
          : n
      ));
    } else if (isPanningCanvas) {
      setCanvasTransform(prev => ({
        ...prev,
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }));
    }
  }, [isDraggingNode, isPanningCanvas, selectedNodeId, dragOffset, canvasTransform]);

  const handleMouseUp = () => {
    setIsDraggingNode(false);
    setIsPanningCanvas(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.shiftKey ? redo() : undo();
    }
  }, [undo, redo]);

  const handleDeploy = async () => {
    setDeploymentStatus('Deploying...');
    const n8nWorkflow = convertSketchToN8nWorkflow(nodes, edges);
    const success = await deployWorkflow(n8nWorkflow);
    setDeploymentStatus(success ? 'Deployment successful!' : 'Deployment failed.');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Placeholder for webhook logic
  useEffect(() => {
    // In a real application, you would set up a webhook endpoint to receive
    // execution status updates from n8n. For now, we'll simulate it.
    const interval = setInterval(() => {
      const nodeId = nodes[Math.floor(Math.random() * nodes.length)]?.id;
      if (nodeId) {
        setExecutionStatus(prev => ({
          ...prev,
          [nodeId]: ['success', 'failure', 'running'][Math.floor(Math.random() * 3)] as 'success' | 'failure' | 'running'
        }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [nodes]);

  const activeModalNode = nodes.find(n => n.id === (modalActiveNodeId || nodes[0]?.id));

  return (
    <div 
      className="flex h-screen w-screen overflow-hidden bg-white relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* API Key Modal Overlay */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-md animate-fade-in p-6">
          <div className="bg-white rounded-[40px] max-w-2xl w-full shadow-2xl border border-gray-100 flex overflow-hidden">
            <div className="w-1/3 bg-gray-50 border-r border-gray-100 p-8 flex flex-col gap-4">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Active Nodes</h4>
              {nodes.map(node => (
                <button 
                  key={node.id}
                  onClick={() => setModalActiveNodeId(node.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all text-left group ${
                    activeModalNode?.id === node.id 
                      ? 'bg-white shadow-lg border border-gray-100 scale-[1.05]' 
                      : 'hover:bg-gray-100 opacity-50 hover:opacity-100'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.accentColor }} />
                  <span className="text-sm font-bold text-gray-800 truncate">{node.service}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-12 relative">
              <button onClick={() => setIsApiKeyModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="google-sans text-3xl font-black text-gray-900 mb-8">Node Credentials</h3>
              
              {activeModalNode && (
                <div className="animate-fade-in">
                  <div className="bg-gray-50 p-6 rounded-[28px] border border-gray-100 mb-8">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Service Context</div>
                     <div className="text-lg font-black text-gray-900">{activeModalNode.service}</div>
                     <div className="text-xs text-gray-500 font-medium mt-1">Provide credentials to authorize the "{activeModalNode.label}" action.</div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Key / Token</label>
                      <input 
                        type="password" 
                        placeholder={`Enter key for ${activeModalNode.service}...`} 
                        className="w-full bg-[#F8FAFC] border border-gray-100 rounded-[24px] px-8 py-5 font-bold text-gray-800 outline-none focus:ring-4 focus:ring-blue-50 transition-all" 
                      />
                      <div className="flex flex-col gap-2 mt-4 px-1">
                        <a 
                          href="#" 
                          className="text-[11px] text-blue-600 font-black hover:underline flex items-center gap-1"
                        >
                          How to find my {activeModalNode.service} key? →
                        </a>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setIsApiKeyModalOpen(false)} className="w-full mt-10 py-5 bg-[#12161D] text-white rounded-[28px] font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95">Verify Connection</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Minimalism Header */}
      <header className="absolute top-0 left-0 right-0 h-[100px] flex items-center justify-between px-12 z-[60] pointer-events-none">
        <div className="flex items-center gap-8 pointer-events-auto">
          <button onClick={onBack} className="p-4 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-[20px] shadow-sm hover:shadow-xl transition-all">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="flex flex-col">
            <span className="google-sans text-[20px] font-bold text-gray-900 leading-none">Architect Workspace</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Draft v1.4.2</span>
          </div>
        </div>

        <div className="flex items-center gap-6 pointer-events-auto">
          {/* Fixed Undo/Redo - High Contrast */}
          <div className="flex bg-white border border-gray-100 p-2 rounded-[24px] shadow-sm">
            <button onClick={undo} disabled={history.length === 0} className="p-3 text-gray-800 hover:bg-gray-50 rounded-xl disabled:text-gray-200 transition-all active:scale-90">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            </button>
            <div className="w-[1px] h-6 bg-gray-100 self-center mx-1" />
            <button onClick={redo} disabled={redoStack.length === 0} className="p-3 text-gray-800 hover:bg-gray-50 rounded-xl disabled:text-gray-200 transition-all active:scale-90">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            {deploymentStatus && <span className="text-sm font-semibold">{deploymentStatus}</span>}
            <button
              onClick={handleDeploy}
              className="bg-[#1A73E8] text-white px-10 py-4 rounded-[24px] text-[14px] font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1"
            >
              Publish to n8n
            </button>
          </div>
        </div>
      </header>

      {/* Floating API Key Trigger */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-[60]">
        <button 
           onClick={() => setIsApiKeyModalOpen(true)}
           className="w-16 h-16 bg-white border border-gray-100 rounded-full shadow-2xl flex items-center justify-center text-gray-900 hover:text-blue-600 hover:scale-110 transition-all active:scale-95 group"
        >
          <ICONS.Key className="w-7 h-7" />
          <div className="absolute right-20 bg-gray-900 text-white text-[10px] font-black py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-widest translate-x-4 group-hover:translate-x-0">
            Vault Keys
          </div>
        </button>
      </div>

      {/* Floating Bottom Input Bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-[60]">
        <div className="bg-white/80 backdrop-blur-3xl rounded-[48px] border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.08)] p-3 flex items-center transition-all focus-within:ring-8 focus-within:ring-blue-50 focus-within:bg-white">
           <div className="flex items-center gap-4 px-8">
              <div className={`w-3 h-3 rounded-full ${isGenerating ? 'bg-blue-500 animate-ping' : 'bg-gray-200'}`} />
           </div>
           <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Sketch a new logic stream..." 
              className="flex-1 bg-transparent border-none outline-none py-6 text-[18px] font-semibold text-gray-800 placeholder:text-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
           />
           <div className="px-4">
              {isGenerating ? (
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <button 
                   onClick={handleSendMessage} 
                   className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              )}
           </div>
        </div>
      </div>

      <main 
        ref={canvasRef} 
        className="flex-1 relative overflow-hidden bg-white canvas-dots cursor-grab active:cursor-grabbing h-full w-full" 
        onMouseDown={handleCanvasMouseDown}
      >
        <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${canvasTransform.x}px, ${canvasTransform.y}px) scale(${canvasTransform.scale})` }}>
          {edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            return sourceNode && targetNode && (
              <Connection key={edge.id} id={edge.id} source={sourceNode} target={targetNode} selected={selectedEdgeId === edge.id} onClick={setSelectedEdgeId} />
            );
          })}
          {nodes.map(node => (
            <Node 
              key={node.id} 
              node={node} 
              selected={selectedNodeId === node.id} 
              executionStatus={executionStatus[node.id]}
              onMouseDown={(e, id) => { 
                e.stopPropagation(); 
                setSelectedNodeId(id); 
                setIsDraggingNode(true); 
                setDragOffset({ x: getCanvasCoords(e.clientX, e.clientY).x - node.position.x, y: getCanvasCoords(e.clientX, e.clientY).y - node.position.y }); 
              }} 
              onPortMouseDown={() => {}} 
              onPortMouseUp={() => { }} 
            />
          ))}
        </div>
      </main>
    </div>
  );
};
