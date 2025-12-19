
import { GoogleGenAI, Type } from "@google/genai";
import { WorkflowState } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateWorkflow(prompt: string): Promise<{ workflow: WorkflowState; explanation: string }> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are an AI workflow architect for "WorkflowHub".
        Interpret user requests and output a JSON object representing a valid automation workflow.
        
        The JSON MUST follow this schema:
        {
          "workflow": {
            "nodes": [
              { "id": "n1", "type": "trigger", "service": "Google Calendar", "label": "Event Created", "position": {"x": 100, "y": 200}, "accentColor": "#FF9900" }
            ],
            "edges": [
              { "id": "e1", "source": "n1", "target": "n2" }
            ]
          },
          "explanation": "Brief human explanation of what the workflow does."
        }
        
        Use service names like "Google Calendar", "OpenAI", "Slack", "Gmail", "Notion".
        Always use #FF9900 for triggers and #A259FF for actions.
        Ensure node IDs are unique. Ensure edges connect existing nodes.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workflow: {
              type: Type.OBJECT,
              properties: {
                nodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      type: { type: Type.STRING },
                      service: { type: Type.STRING },
                      label: { type: Type.STRING },
                      position: {
                        type: Type.OBJECT,
                        properties: {
                          x: { type: Type.NUMBER },
                          y: { type: Type.NUMBER }
                        }
                      },
                      accentColor: { type: Type.STRING }
                    },
                    required: ["id", "type", "service", "label", "position", "accentColor"]
                  }
                },
                edges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      source: { type: Type.STRING },
                      target: { type: Type.STRING }
                    },
                    required: ["id", "source", "target"]
                  }
                }
              },
              required: ["nodes", "edges"]
            },
            explanation: { type: Type.STRING }
          },
          required: ["workflow", "explanation"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      throw new Error("Invalid response format from Gemini");
    }
  }

  async chat(message: string, history: { role: 'user' | 'model', parts: [{text: string}] }[]) {
     const chat = this.ai.chats.create({
       model: 'gemini-3-pro-preview',
       config: {
         systemInstruction: "You are Gemini, a helpful assistant in WorkflowHub. You can answer questions about automation, API configurations, and help refine workflows."
       }
     });
     
     const result = await chat.sendMessage({ message });
     return result.text;
  }
}

export const gemini = new GeminiService();
