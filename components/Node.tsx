
import React from 'react';
import { WorkflowNode } from '../types';
import { ICONS } from '../constants';

interface NodeProps {
  node: WorkflowNode;
  selected?: boolean;
  executionStatus?: 'success' | 'failure' | 'running';
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onPortMouseDown: (e: React.MouseEvent, nodeId: string, portType: 'in' | 'out') => void;
  onPortMouseUp: (e: React.MouseEvent, nodeId: string, portType: 'in' | 'out') => void;
}

export const Node: React.FC<NodeProps> = ({ 
  node, 
  selected, 
  executionStatus,
  onMouseDown, 
}) => {
  const serviceLower = node.service.toLowerCase();
  
  const getIcon = () => {
    if (serviceLower.includes('google')) return ICONS.Google;
    if (serviceLower.includes('slack')) return ICONS.Slack;
    if (serviceLower.includes('openai')) return ICONS.OpenAI;
    return ICONS.Home;
  };

  const Icon = getIcon();

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, node.id)}
      className={`absolute w-[220px] bg-white rounded-[28px] transition-all select-none cursor-grab active:cursor-grabbing flex items-center z-10 p-[2px] ${
        selected 
          ? 'scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[#1A73E8]' 
          : 'shadow-[0_4px_15px_rgba(0,0,0,0.03)] border-transparent'
      } border-2 group sketched-node`}
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
    >
      <div className="flex items-center gap-4 bg-white w-full h-full rounded-[24px] px-5 py-4">
        <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gray-50/50 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold leading-tight truncate text-gray-900">
            {node.service}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.accentColor }} />
            <span className="text-[9px] font-black uppercase tracking-widest truncate text-gray-400">
              {node.label}
            </span>
          </div>
        </div>
      </div>
      {executionStatus && (
        <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${
          executionStatus === 'success' ? 'bg-green-500' :
          executionStatus === 'failure' ? 'bg-red-500' :
          'bg-yellow-500'
        }`} />
      )}
      <style jsx>{`
        .sketched-node {
          border: 2px solid #000;
          border-radius: 28px;
          box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
        }
      `}</style>
    </div>
  );
};
