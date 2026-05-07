import { api } from '../lib/api';


import { AIService } from './aiService';export interface SpacedReviewItem {
  id: string; // submission_id
  atividade_id: string;
  titulo: string;
  descricao: string;
  ultimaNota: number;
  pontosMelhoria: string[];
  nivelUrgencia: 'ALTO' | 'MEDIO' | 'BAIXO';
  proximaRevisao: Date;
  strength: number; // 0-100 retention
}

export const SRSService = {
  async getItemsToReview(studentId: string): Promise<SpacedReviewItem[]> {
    // Buscar as submissões recentes do aluno com nota baixa/média
    const { data: submissions, error } = await api
      .from('submissoes')
      .select(`
        id,
        nota,
        feedback_ia,
        created_at,
        aluno_id,
        atividade_id,
        atividades (
          id,
          titulo,
          descricao,
          tipo
        )
      `)
      .eq('aluno_id', studentId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !submissions) {
      console.error("SRS Error:", error);
      return [];
    }

    const today = new Date();
    
    const items: SpacedReviewItem[] = [];

    // Lógica simplificada de SRS
    for (const sub of submissions) {
      // Ignora se não houver atividade associada ou nota não for número
      if (!sub.atividades) continue;
      
      let nota = 10;
      if (typeof sub.nota === 'number') {
        nota = sub.nota;
      } else if (typeof sub.nota === 'string') {
        nota = parseFloat(sub.nota);
      }
      
      // Se a nota foi muito boa, o agendamento é mais pro futuro e a força é alta
      let diasAgendar = 7;
      let urgencia: 'ALTO' | 'MEDIO' | 'BAIXO' = 'BAIXO';
      let strength = 80;

      if (nota < 5) {
        diasAgendar = 1;
        urgencia = 'ALTO';
        strength = Math.max(0, nota * 10);
      } else if (nota < 8) {
        diasAgendar = 3;
        urgencia = 'MEDIO';
        strength = Math.max(0, nota * 10);
      }

      // Em um cenário real, também veríamos quando a atividade foi SUBMETIDA
      const dataSub = new Date(sub.created_at);
      const proximaRevisao = new Date(dataSub.getTime() + (diasAgendar * 24 * 60 * 60 * 1000));
      
      // Monta os pontos de melhoria a partir do feedback da IA
      let pontos = ['Revisão dos conceitos base abordados.'];
      if (sub.feedback_ia) {
        // Tenta extrair linhas que comecem com traço (bullet points)
        const lines = sub.feedback_ia.split('\n');
        const bullets = lines.filter((l: string) => l.trim().startsWith('-'));
        if (bullets.length > 0) {
          pontos = bullets.map((b: string) => b.substring(1).trim()).slice(0, 3);
        } else {
           // Pega a primeira frase
           pontos = [sub.feedback_ia.split('.')[0] + '.'];
        }
      }

      items.push({
        id: sub.id,
        atividade_id: (sub.atividades as any)?.id || sub.atividade_id,
        titulo: (sub.atividades as any)?.titulo || 'Atividade',
        descricao: (sub.atividades as any)?.descricao || 'Atividade pedagógica',
        ultimaNota: nota,
        pontosMelhoria: pontos,
        nivelUrgencia: urgencia,
        proximaRevisao,
        strength
      });
    }

    return items;
  },

  async generateReviewQuiz(item: SpacedReviewItem) {
    const prompt = `Atue como um tutor especializado. 
O aluno precisa revisar o conteúdo da atividade: "${item.titulo}".
Contexto: ${item.descricao}.
O aluno teve dificuldades nestes pontos: ${item.pontosMelhoria.join('; ')}.

Gere 3 perguntas de múltipla escolha focadas ESPECIFICAMENTE nestes pontos de dificuldade.
Forneça 4 opções de resposta para cada pergunta com apenas UMA correta.
A linguagem deve ser encorajadora.`;

    const schema = {
      introducao: "Mensagem motivacional de introdução",
      perguntas: [
        {
          pergunta: "[A pergunta fonecendo os dados]",
          opcoes: ["[A]", "[B]", "[C]", "[D]"],
          respostaCorretaIndex: 0,
          explicacao: "Por que a resposta está correta"
        }
      ],
      dicaGeralEstudo: "Uma dica rápida de estudo baseada na dificuldade"
    };

    return await AIService.generateJSON(prompt, schema);
  }
};
