
import React from 'react';
import { WorkflowNode } from '../types';

interface ConnectionProps {
  source: WorkflowNode;
  target: WorkflowNode;
}

export const Connection: React.FC<ConnectionProps> = ({ source, target }) => {
  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 72;

  const startX = source.position.x + NODE_WIDTH;
  const startY = source.position.y + NODE_HEIGHT / 2;
  const endX = target.position.x;
  const endY = target.position.y + NODE_HEIGHT / 2;

  // Subtle Bezier curve
  const midX = startX + (endX - startX) * 0.5;
  const path = `M ${startX} ${startY} Q ${midX} ${startY + (endY - startY) * 0.2}, ${endX} ${endY}`;

  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
        </marker>
      </defs>
      <path
        d={path}
        className="bezier-curve"
        strokeLinecap="round"
        fill="transparent"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
};
