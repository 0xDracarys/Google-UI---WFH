
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

// n8n-specific types
export interface N8NNode {
  parameters: any;
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  credentials?: any;
}

export interface N8NConnectionData {
  node: string;
  input: string | string[][];
}


export interface N8NConnection {
  main: N8NConnectionData[][];
}


export type N8NConnections = Record<string, N8NConnection>;

export interface N8NWorkflow {
  name: string;
  nodes: N8NNode[];
  connections: N8NConnections;
  active: boolean;
  settings: any;
  id?: string;
  tags?: string;
}
