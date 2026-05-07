// src/services/aiClient.ts

/**
 * Proxy Client to prevent GEMINI_API_KEY exposure in the frontend.
 * This class emulates the GoogleGenAI interface but calls our secure backend endpoint.
 */
export class ProxiedGoogleGenAI {
  public models = {
    generateContent: async ({ model, contents, systemInstruction }: any) => {
      try {
        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, contents, systemInstruction })
        });
        
        if (!res.ok) {
          throw new Error(await res.text());
        }
        
        const data = await res.json();
        return { text: data.text || '' };
      } catch (error) {
        console.error("AI Proxy Error:", error);
        throw error;
      }
    }
  };

  // Keep constructor signature similar to avoid TS errors in the agents
  constructor(config?: { apiKey?: string }) {
    // Config ignored since backend handles it
  }
}

// Emulate GoogleGenAI for easier replace
export const GoogleGenAI = ProxiedGoogleGenAI;
export type GoogleGenAI = ProxiedGoogleGenAI;
