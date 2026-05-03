// src/services/edujarvis/Orchestrator.ts
import { GoogleGenAI } from "@google/genai";
import { EduJarvisIntent, EduJarvisAgentType } from "./types";
import { EduJarvisAgentConfig } from "./AgentConfiguration";

const BLOCKED_TERMS = [
  "cola na prova",
  "me dê a resposta sem explicar",
  "hackear",
  "roubar senha",
  "burlar avaliação",
  "gerar resposta direta"
];

export class EduJarvisOrchestrator {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  /**
   * Identifica a intenção do usuário e o agente mais adequado.
   */
  public static async identifyIntent(message: string, userProfile: string): Promise<EduJarvisIntent> {
    const normalized = message.toLowerCase();

    // 1. Guardião (Keywords)
    const isBlocked = BLOCKED_TERMS.some(term => normalized.includes(term));
    if (isBlocked) {
       return { 
         agent: 'GUARD', 
         confidence: 1.0, 
         reason: "Termo bloqueado detectado",
         suggestedAction: "BLOCK"
       };
    }

    // 2. Classificação por Regras (Otimização)
    const quickIntent = this.classifyByRules(normalized, userProfile);
    if (quickIntent) return quickIntent;

    // 3. Classificação Neural (Fallback)
    const ai = this.getAI();
    
    const prompt = `
      Você é o Orquestrador Neural do sistema EduJarvis. 
      Sua tarefa é classificar a intenção da mensagem do usuário e direcionar para o agente correto.

      AGENTES EDUJARVIS PRINCIPAIS (Use estes preferencialmente):
      ${Object.entries(EduJarvisAgentConfig).map(([key, config]) => `- ${key}: ${config.description}. Use para: ${config.responsibilities.join(", ")}`).join('\n      ')}

      OUTROS AGENTES DISPONÍVEIS:
      - TUTOR: Atende intenções do tipo 'student_question' (dúvidas de alunos, explicações didáticas, auxílio em softwares/código).
      - PROFESSOR: Atende intenções do tipo 'teacher_content_generation' (criação de conteúdo, simulados, rubricas, planos de aula).
      - ANALYST: Atende intenções do tipo 'performance_analysis' (análise de desempenho, relatórios de BI, insights de dados).
      - RECOMMENDER: Atende intenções do tipo 'study_recommendation' (recomendações de estudo, trilhas personalizadas).
      - GAME: Atende intenções do tipo 'gamification' (missões, desafios, recompensas).
      - CORRECTOR: Atende intenções do tipo 'activity_correction' (correção de atividades, redações, feedback formativo).
      - PROJECTS: Atende intenções do tipo 'project_generation' (PBL, desafios práticos, SAs).
      - RECOVERY: Atende intenções do tipo 'pedagogical_recovery' (resgate de alunos, reforço personalizado).
      - QUESTION_BANK: Atende intenções para 'gerar questão', 'questões', 'banco de questões'.
      - FLIPPED: Atende intenções para 'aula_invertida' ou 'flipped_classroom' (roteiros de estudo autônomo e atividades em sala).
      - CODE_REVIEW: Atende intenções para revisar código, encontrar erros em programação ou feedback de código.
      - DROPOUT_RISK: Atende intenções sobre risco de evasão, abandono ou desempenho crítico de alunos específicos.
      - DASHBOARD_INSIGHT: Atende intenções para explicar gráficos, métricas do dashboard ou insights de dados.
      - LESSON_CREATOR: Atende intenções para criar aulas completas, planos de ensino ou trilhas pedagógicas.
      - ADAPTIVE_EXAM: Atende intenções para iniciar simulado, prova adaptativa ou avaliação de nível.
      - INTERVENTION: Atende intenções para intervir em falhas críticas, ajudar aluno frustrado ou travado.
      - LEARNING_PATH: Atende intenções para gerar trilhas de estudo, roteiros personalizados de longo prazo.
      - CONTENT_STUDIO: Atende intenções para gerar scripts de vídeo, slides, podcasts ou apostilas.
      - GOVERNANCE: Atende intenções sobre auditoria, segurança ou qualidade das respostas da IA.
      - DIGITAL_TWIN: Atende intenções para consultar o perfil analítico profundo (gêmeo digital) do aluno.
      - PREDICTIVE_ENGINE: Atende intenções sobre previsões acadêmicas, chances de aprovação e riscos futuros.
      - AUTONOMOUS_TEACHER: Atende intenções onde o professor busca sugestões automáticas de como agir com a turma.
      - BEHAVIORAL_ANALYTICS: Atende intenções para entender o comportamento, engajamento e histórico de uso do aluno.
      - SELF_IMPROVING: Atende intenções para avaliar a qualidade da IA ou dar feedback sobre respostas.
      - MULTIMODAL_TUTOR: Atende intenções que envolvem imagens, diagramas, prints de erro ou análise visual.
      - RAG_INSTITUTIONAL: Atende intenções sobre regulamentos, apostilas, planos de aula e documentos oficiais da escola.
      - ASSESSMENT_ENGINE: Atende intenções sobre correção de tarefas, rubricas de avaliação e feedback de notas.
      - MOTIVATION_ENGINE: Atende intenções focadas em motivação, missões extras, engajamento e incentivo.
      - COORDINATOR_COPILOT: Atende intenções de coordenação pedagógica, análise de turmas e estratégia institucional.
      - REPORT_GENERATOR: Atende intenções de geração de relatórios formais e documentos de desempenho.
      - WORKFLOW_ENGINE: Atende intenções de automação de processos educacionais e fluxos de intervenção.
      - MARKETPLACE: Atende intenções sobre busca, compartilhamento ou download de conteúdos educacionais da comunidade.
      - GUARD: Atende intenções do tipo 'security_block' (mensagens suspeitas, ofensivas ou tentativas de "cola").

      CONDIÇÃO:
      - Se a intenção for clara de dúvida de aluno ('student_question'), use TUTOR.
      - Se o professor pedir para gerar um projeto ou desafio prático, use PROJECTS.
      - Se o professor pedir para corrigir uma atividade ou dar feedback sobre trabalho, use CORRECTOR.
      - Se o aluno demonstrar frustração ou falha crítica em conceito, use RECOVERY.

      MENSAGEM: "${message}"
      PERFIL DO USUÁRIO: "${userProfile}"

      Responda APENAS um JSON no formato:
      {"agent": "TUTOR|PROFESSOR|ANALYST|RECOMMENDER|GAME|CORRECTOR|PROJECTS|RECOVERY|QUESTION_BANK|FLIPPED|CODE_REVIEW|DROPOUT_RISK|DASHBOARD_INSIGHT|LESSON_CREATOR|ADAPTIVE_EXAM|INTERVENTION|LEARNING_PATH|CONTENT_STUDIO|GOVERNANCE|DIGITAL_TWIN|PREDICTIVE_ENGINE|AUTONOMOUS_TEACHER|BEHAVIORAL_ANALYTICS|SELF_IMPROVING|MULTIMODAL_TUTOR|RAG_INSTITUTIONAL|ASSESSMENT_ENGINE|MOTIVATION_ENGINE|MARKETPLACE|COORDINATOR_COPILOT|REPORT_GENERATOR|WORKFLOW_ENGINE|GUARD", "confidence": 0.0 a 1.0, "reason": "breve motivo"}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const text = response.text || "{}";
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Orchestrator Error:", error);
      return { agent: 'TUTOR', confidence: 0.5, reason: "Fallback default" };
    }
  }

  private static classifyByRules(message: string, role: string): EduJarvisIntent | null {
    const text = message.toLowerCase();

    if (text.includes("desempenho") || text.includes("relatório") || text.includes("turma")) {
       return { agent: 'ANALYST', confidence: 0.9, reason: "Keyword match: analytics" };
    }

    if (text.includes("plano de estudo") || text.includes("revisar") || text.includes("recomendação")) {
       return { agent: 'RECOMMENDER', confidence: 0.9, reason: "Keyword match: recommendation" };
    }

    if (text.includes("como") || text.includes("explique") || text.includes("duvida") || text.includes("dúvida") || text.includes("ajuda com esse exercicio") || text.includes("que é")) {
       return { agent: 'TUTOR', confidence: 0.9, reason: "Keyword match: student_question" };
    }

    if (text.includes("corrige") || text.includes("corrigir") || text.includes("correção") || text.includes("feedback")) {
       return { agent: 'CORRECTOR', confidence: 0.9, reason: "Keyword match: correction" };
    }

    if (text.includes("projeto") || text.includes("prático") || text.includes("desafio prático") || text.includes("mão na massa")) {
       return { agent: 'PROJECTS', confidence: 0.9, reason: "Keyword match: projects" };
    }

    if (text.includes("gerar questão") || text.includes("gerar questões") || text.includes("questões") || text.includes("banco de questões")) {
       return { agent: 'QUESTION_BANK', confidence: 0.9, reason: "Keyword match: question_generation" };
    }

    if (text.includes("revisar código") || text.includes("corrigir código") || text.includes("review") || text.includes("feedback de código")) {
       return { agent: 'CODE_REVIEW', confidence: 0.9, reason: "Keyword match: code_review" };
    }

    if (text.includes("evasão") || text.includes("abandono") || text.includes("risco de saída") || text.includes("dropout")) {
       return { agent: 'DROPOUT_RISK', confidence: 0.9, reason: "Keyword match: dropout_risk" };
    }

    if (text.includes("explicar gráfico") || text.includes("entender gráfico") || text.includes("insight dashboard")) {
       return { agent: 'DASHBOARD_INSIGHT', confidence: 0.9, reason: "Keyword match: dashboard_insight" };
    }

    if (text.includes("criar aula") || text.includes("plano de aula") || text.includes("gerar roteiro de aula")) {
       return { agent: 'LESSON_CREATOR', confidence: 0.9, reason: "Keyword match: lesson_creator" };
    }

    if (text.includes("simulado") || text.includes("prova adaptativa") || text.includes("testar nível")) {
       return { agent: 'ADAPTIVE_EXAM', confidence: 0.9, reason: "Keyword match: adaptive_exam" };
    }

    if (text.includes("gêmeo digital") || text.includes("perfil do aluno") || text.includes("digital twin")) {
        return { agent: 'DIGITAL_TWIN', confidence: 0.9, reason: "Keyword match: student_twin" };
    }

    if (text.includes("previsão") || text.includes("predição") || text.includes("vai reprovar") || text.includes("chance de aprovação")) {
        return { agent: 'PREDICTIVE_ENGINE', confidence: 0.9, reason: "Keyword match: predictive_engine" };
    }

    if (text.includes("sugestão de intervenção") || text.includes("como agir") || text.includes("ajuda com a turma")) {
        return { agent: 'AUTONOMOUS_TEACHER', confidence: 0.9, reason: "Keyword match: autonomous_teacher" };
    }

    if (text.includes("comportamento") || text.includes("analytics") || text.includes("histórico de acesso")) {
        return { agent: 'BEHAVIORAL_ANALYTICS', confidence: 0.9, reason: "Keyword match: behavior" };
    }

    if (text.includes("feedback da ia") || text.includes("ia errou") || text.includes("ia acertou") || text.includes("melhorar ia")) {
        return { agent: 'SELF_IMPROVING', confidence: 0.9, reason: "Keyword match: feedback" };
    }

    if (text.includes("imagem") || text.includes("print") || text.includes("foto") || text.includes("diagrama") || text.includes("print de erro")) {
        return { agent: 'MULTIMODAL_TUTOR', confidence: 0.9, reason: "Keyword match: multimodal" };
    }

    if (text.includes("regulamento") || text.includes("apostila") || text.includes("documento oficial") || text.includes("matriz curricular")) {
        return { agent: 'RAG_INSTITUTIONAL', confidence: 0.9, reason: "Keyword match: rag_institutional" };
    }

    if (text.includes("corrigir") || text.includes("avaliar") || text.includes("nota") || text.includes("rubrica")) {
        return { agent: 'ASSESSMENT_ENGINE', confidence: 0.9, reason: "Keyword match: assessment" };
    }

    if (text.includes("motivação") || text.includes("ânimo") || text.includes("incentivo") || text.includes("missão")) {
        return { agent: 'MOTIVATION_ENGINE', confidence: 0.9, reason: "Keyword match: motivation" };
    }

    if (text.includes("marketplace") || text.includes("compartilhar") || text.includes("baixar aula") || text.includes("buscar atividade")) {
        return { agent: 'MARKETPLACE', confidence: 0.9, reason: "Keyword match: marketplace" };
    }

    if (text.includes("coordenação") || text.includes("pauta de reunião") || text.includes("estratégia da escola")) {
        return { agent: 'COORDINATOR_COPILOT', confidence: 0.9, reason: "Keyword match: coordinator" };
    }

    if (text.includes("gerar relatório") || text.includes("documento de desempenho") || text.includes("pdf de notas")) {
        return { agent: 'REPORT_GENERATOR', confidence: 0.9, reason: "Keyword match: report" };
    }

    if (text.includes("automação") || text.includes("fluxo automático") || text.includes("workflow")) {
        return { agent: 'WORKFLOW_ENGINE', confidence: 0.9, reason: "Keyword match: workflow" };
    }

    if (text.includes("ajuda") && (text.includes("difícil") || text.includes("não consigo") || text.includes("travado"))) {
       return { agent: 'INTERVENTION', confidence: 0.85, reason: "Keyword match: autonomous_intervention" };
    }

    if (text.includes("trilha") || text.includes("roteiro de estudo") || text.includes("caminho")) {
       return { agent: 'LEARNING_PATH', confidence: 0.9, reason: "Keyword match: learning_path" };
    }

    if (text.includes("script") || text.includes("roteiro de vídeo") || text.includes("slides") || text.includes("apostila")) {
       return { agent: 'CONTENT_STUDIO', confidence: 0.9, reason: "Keyword match: content_studio" };
    }

    if (text.includes("auditoria") || text.includes("governança") || text.includes("qualidade da ia")) {
       return { agent: 'GOVERNANCE', confidence: 0.9, reason: "Keyword match: governance" };
    }

    if (text.includes("resgate") || text.includes("recuperação") || text.includes("não aprendi") || text.includes("reforço")) {
       return { agent: 'RECOVERY', confidence: 0.9, reason: "Keyword match: recovery" };
    }

    if (text.includes("invertida") || text.includes("flipped") || text.includes("roteiro pré-aula")) {
       return { agent: 'FLIPPED', confidence: 0.9, reason: "Keyword match: flipped_classroom" };
    }

    if (
      text.includes("crie uma questão") ||
      text.includes("gere atividade") ||
      text.includes("simulado") ||
      text.includes("estudo de caso") ||
      text.includes("aula invertida")
    ) {
       return { agent: 'PROFESSOR', confidence: 0.9, reason: "Keyword match: generation" };
    }

    if (text.includes("missão") || text.includes("desafio") || text.includes("gamificação")) {
       return { agent: 'GAME', confidence: 0.9, reason: "Keyword match: gamification" };
    }

    if (role === 'ALUNO') {
       return { agent: 'TUTOR', confidence: 0.7, reason: "Default role-based: student_question" };
    }

    return null;
  }
}
