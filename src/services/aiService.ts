import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY
});

// Tier models based on cost and capability as defined in NEXUSINTAI Arch
const MODELS = {
  FLEET: 'gemini-2.5-flash', // Fast, cheaper, for simple tasks, chat, student tutor
  PREMIUM: 'gemini-2.5-pro', // Powerful, for robust SA Generation, Lesson Planning
};

export const aiService = {
  /**
   * Generates text using the specified tier.
   * @param prompt The prompt to execute
   * @param tier FLEET (cheaper, default) or PREMIUM (advanced reasoning)
   */
  async generateText(prompt: string, tier: 'FLEET' | 'PREMIUM' = 'FLEET'): Promise<string> {
     try {
        const response = await ai.models.generateContent({
           model: MODELS[tier],
           contents: prompt
        });
        
        return response.text || '';
     } catch (err) {
        console.error("aiService error (generateText)", err);
        throw new Error("Falha ao se comunicar com os motores NEXUSINTAI.");
     }
  },

  /**
   * Generates structured JSON output ensuring the scheme is followed.
   * @param prompt The prompt detailing what to extract
   * @param schema The Type schema from @google/genai 
   * @param tier FLEET or PREMIUM
   */
  async generateJSON<T>(prompt: string, schema: any, tier: 'FLEET' | 'PREMIUM' = 'FLEET'): Promise<T> {
     try {
        const response = await ai.models.generateContent({
           model: MODELS[tier],
           contents: prompt,
           config: {
              responseMimeType: "application/json",
              responseSchema: schema,
           }
        });
        
        return JSON.parse(response.text || '{}') as T;
     } catch (err) {
        console.error("aiService error (generateJSON)", err);
        throw new Error("Falha ao gerar dados estruturados via IA.");
     }
  }
};
