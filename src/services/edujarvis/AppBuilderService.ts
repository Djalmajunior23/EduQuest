// src/services/edujarvis/AppBuilderService.ts
import { GoogleGenAI } from "@/services/aiClient";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class AppBuilderService {
  public static async generateAppBase(data: {
    tenantId: string;
    userId: string;
    description: string;
    appType: string;
  }) {
    const ai = new GoogleGenAI({});
    const prompt = `Como um Gerador de Mini-Aplicações Educacionais (App Builder), gere uma configuração JSON para um app descito como: ${data.description}.
    Tipo: ${data.appType}.
    Retorne em JSON: {"appName": "", "uiComponents": [], "logicalState": [], "codeSnippet": ""}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");

    await addDoc(collection(db, "app_builder_projects"), {
      tenantId: data.tenantId,
      createdBy: data.userId,
      title: parsed.appName || data.appType,
      appType: data.appType,
      config: JSON.stringify(parsed),
      status: "draft",
      createdAt: serverTimestamp()
    });

    return parsed;
  }
}
