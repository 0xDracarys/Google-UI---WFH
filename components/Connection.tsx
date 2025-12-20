import React from 'react';
import { WorkflowNode } from '../types';

interface ConnectionProps {
  id: string;
  source: WorkflowNode;
  target: WorkflowNode;
  selected?: boolean;
  onClick?: (id: string) => void;
}

export const Connection: React.FC<ConnectionProps> = ({ id, source, target, selected, onClick }) => {
  const NODE_WIDTH = 260;
  const NODE_HEIGHT = 80;

  const startX = source.position.x + NODE_WIDTH;
  const startY = source.position.y + NODE_HEIGHT / 2;
  const endX = target.position.x;
  const endY = target.position.y + NODE_HEIGHT / 2;

  const dx = endX - startX;
  const dy = endY - startY;
  
  // Organic Bezier curve logic
  const isBackwards = dx < 0;
  const minCurvature = 40;
  const horizontalInfluence = Math.max(Math.abs(dx) * 0.45, minCurvature);
  const verticalInfluence = Math.abs(dy) * 0.15;
  const backwardBoost = isBackwards ? Math.max(120, Math.abs(dx) * 1.2) : 0;
  const cp = horizontalInfluence + verticalInfluence + backwardBoost;

  const path = `M ${startX} ${startY} C ${startX + cp} ${startY}, ${endX - cp} ${endY}, ${endX} ${endY}`;

  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-0">
      <defs>
        <marker id={`arrow-${id}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={selected ? "#1A73E8" : "#cbd5e1"} />
        </marker>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={source.accentColor} />
          <stop offset="100%" stopColor={target.accentColor} />
        </linearGradient>
      </defs>
      
      {/* Thick invisible path for interaction */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth="24"
        fill="none"
        className="pointer-events-auto cursor-pointer"
        onClick={(e) => { e.stopPropagation(); onClick?.(id); }}
      />
      
      {/* Single elegant gradient path */}
      <path
        d={path}
        stroke={`url(#grad-${id})`}
        strokeWidth={selected ? "3" : "2"}
        strokeOpacity={selected ? "1" : "0.5"}
        strokeLinecap="round"
        fill="transparent"
        className="transition-all duration-300"
        markerEnd={`url(#arrow-${id})`}
      />
    </svg>
  );
};