
export type NodeType = 'trigger' | 'action';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  service: string; // e.g., 'Google Calendar', 'OpenAI'
  label: string;   // e.g., 'Event Created', 'Generate Summary'
  position: { x: number; y: number };
  accentColor: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isDrafting?: boolean;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
