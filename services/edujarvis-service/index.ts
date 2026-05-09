import { GoogleGenAI } from "@google/genai";

export class EduJarvisService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI(process.env.GEMINI_API_KEY || '');
  }

  async generatePedagogicalInsights(studentId: string, performanceData: any) {
    // Integração com Gemini para análise de desempenho
    const model = this.ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Analise o seguinte desempenho do estudante e gere insights pedagógicos: ${JSON.stringify(performanceData)}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async tutorChat(message: string, context: string) {
    const model = this.ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 500 }
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  }
}

export const edujarvisService = new EduJarvisService();
