# WorkflowHub Sketchbook: The AI-Native Automation Workbench

## 🎯 Project Vision
WorkflowHub Sketchbook is a revolutionary approach to digital automation. It reimagines the "automation engineer" as a "sketch artist," allowing users to describe intent in natural language to Gemini 3 Flash, which then architects a live, collaborative automation sketch.

## 🏗️ Real n8n Integration: Technical Guide
To transition from a "sketch" to a live production environment, follow this architectural setup:

### 1. The Bridge Configuration
1. **Endpoint**: Your private n8n instance `https://n8n.yourcompany.com/api/v1`.
2. **Authentication**: Use n8n API keys (Header: `X-N8N-API-KEY`).
3. **Synchronization Logic**:
   - The Sketchbook serializes the `WorkflowState` into n8n's standard JSON format.
   - **Nodes Mapping**:
     - `service: "Google Calendar"` maps to `n8n-nodes-base.googleCalendarTrigger`.
     - `service: "OpenAI"` maps to `n8n-nodes-base.openAi`.
   - **Parameter Mapping**: Gemini handles the translation of natural language prompts into the specific JSON parameters required by n8n nodes.

### 2. Implementation Steps
- **POST /workflows**: Create the workflow in n8n.
- **POST /workflows/:id/activate**: Activate for production use.
- **Webhook Sync**: Use n8n webhooks to feed execution status back into the Sketchbook UI.

## 🚀 Aim
Lower the barrier to entry for enterprise automation by 10x, enabling non-technical teams to build high-scale architecture through simple conversation.