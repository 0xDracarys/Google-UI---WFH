
import { GoogleGenAI, Type } from "@google/genai";
import { WorkflowState } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateWorkflow(prompt: string): Promise<{ workflow: WorkflowState; explanation: string }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are a world-class AI Automation Architect.
        Your task is to convert a human description of a workflow into a high-fidelity "sketch" JSON object.
        
        RULES:
        1. Output a JSON object following the schema provided.
        2. Service names must be clear and map to a valid n8n node type.
        3. Supported n8n types: 'n8n-nodes-base.googleCalendarTrigger', 'n8n-nodes-base.openAi', 'n8n-nodes-base.slack'.
        4. Accent Colors: Use #FF9900 for triggers, #A259FF for actions.
        5. Layout: Space nodes logically from left to right.
        
        SCHEMA:
        {
          "workflow": {
            "nodes": [
              { "id": "n1", "type": "trigger", "service": "Service Name", "label": "Specific Action", "position": {"x": 100, "y": 200}, "accentColor": "#FF9900" }
            ],
            "edges": [
              { "id": "e1", "source": "n1", "target": "n2" }
            ]
          },
          "explanation": "Human-readable explanation."
        }`,
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
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      throw new Error("Invalid response format from Gemini");
    }
  }

  async generateProjectImage(prompt: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Professional software visualization: ${prompt}, sleek 3D isometric automation nodes, dark navy background, glowing light trails, enterprise software UI aesthetic, high fidelity, 4k.`,
            },
          ],
        },
      });

      for (const part of response.candidates?.[0].content.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (e) {
      console.error("Image generation failed:", e);
      return null;
    }
  }
}

export const gemini = new GeminiService();
