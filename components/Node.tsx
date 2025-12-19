
import React from 'react';
import { WorkflowNode } from '../types';
import { ICONS } from '../constants';

interface NodeProps {
  node: WorkflowNode;
  selected?: boolean;
}

export const Node: React.FC<NodeProps> = ({ node, selected }) => {
  const isTrigger = node.type === 'trigger';
  const Icon = node.service.includes('Calendar') ? ICONS.Calendar : ICONS.OpenAI;

  return (
    <div
      className={`absolute w-[240px] bg-white rounded-[12px] node-shadow transition-all border-l-[6px] select-none cursor-move flex flex-col justify-center min-h-[72px] z-10 ${
        selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        borderLeftColor: node.accentColor,
      }}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
          <Icon className="w-8 h-8" />
        </div>
        <div className="overflow-hidden">
          <h3 className="text-[14px] font-semibold text-gray-800 leading-tight truncate">{node.service}</h3>
          <p className="text-[11px] text-gray-500 font-medium truncate">
            {isTrigger ? 'Trigger: ' : 'Action: '}
            {node.label}
          </p>
        </div>
      </div>
      
      {/* "Processing..." indicator for OpenAI action node as seen in screenshot */}
      {node.service === 'OpenAI' && (
        <div className="px-4 pb-3 flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold -mt-1">
          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Processing...
        </div>
      )}

      {/* Input/Output Pins matching screenshot */}
      {isTrigger ? (
        <div className="absolute top-1/2 -right-[5px] -translate-y-1/2 w-2.5 h-2.5 bg-gray-400 rounded-full border border-white" />
      ) : (
        <>
          <div className="absolute top-1/2 -left-[5px] -translate-y-1/2 w-2.5 h-2.5 bg-gray-400 rounded-full border border-white" />
        </>
      )}
    </div>
  );
};
