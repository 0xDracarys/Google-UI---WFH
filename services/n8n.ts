
import { WorkflowNode, WorkflowEdge, N8NWorkflow, N8NNode, N8NConnections } from '../types';

/**
 * A mapping from user-friendly service names to the internal n8n node type identifiers.
 * This will be expanded as more services are supported.
 */
const serviceToN8nTypeMap: Record<string, string> = {
  'Google Calendar': 'n8n-nodes-base.googleCalendarTrigger',
  'OpenAI': 'n8n-nodes-base.openAi',
  'Slack': 'n8n-nodes-base.slack',
  // Add other service mappings here
};

/**
 * Converts the frontend's workflow sketch (nodes and edges) into a format
 * that is compatible with the n8n API.
 *
 * @param nodes - An array of workflow nodes from the UI state.
 * @param edges - An array of workflow edges (connections) from the UI state.
 * @returns An N8NWorkflow object ready to be sent to the n8n backend.
 */
export const convertSketchToN8nWorkflow = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): N8NWorkflow => {
  const n8nNodes: N8NNode[] = nodes.map(node => ({
    id: node.id,
    name: node.service, // Use the service name as the node name by default
    type: serviceToN8nTypeMap[node.service] || 'n8n-nodes-base.unknown', // Map to n8n type
    typeVersion: 1,
    position: [node.position.x, node.position.y],
    parameters: {}, // Parameters will be added in a future step
    credentials: {}, // Credentials will be handled separately
  }));

  const n8nConnections: N8NConnections = {};
  edges.forEach(edge => {
    // n8n expects the connection to be defined on the source node's output
    if (!n8nConnections[edge.source]) {
      n8nConnections[edge.source] = { main: [[]] };
    }
    // For now, we assume a single output port ('main') and a single input port
    n8nConnections[edge.source].main[0].push({
      node: edge.target,
      input: 'main', // Connect to the 'main' input of the target
    });
  });

  return {
    name: 'WorkflowHub Sketch',
    nodes: n8nNodes,
    connections: n8nConnections,
    active: false,
    settings: {}, // Default settings
  };
};

/**
 * Deploys a workflow to the n8n backend.
 *
 * @param workflow - The n8n-compatible workflow object.
 */
export const deployWorkflow = async (workflow: N8NWorkflow): Promise<boolean> => {
  const apiUrl = import.meta.env.VITE_N8N_API_URL;
  const apiKey = import.meta.env.VITE_N8N_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error('Missing n8n API URL or API Key in environment variables.');
    return false;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': apiKey,
      },
      body: JSON.stringify(workflow),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Workflow deployed successfully:', responseData);
      return true;
    } else {
      const errorData = await response.json();
      console.error('Failed to deploy workflow:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error('Error deploying workflow:', error);
    return false;
  }
};
