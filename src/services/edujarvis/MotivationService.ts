// src/services/edujarvis/MotivationService.ts

export interface MotivationData {
  alunoNome?: string;
  nivel: string;
  evolucao: number;
  dificuldadeAtual?: string;
}

export class MotivationService {
  /**
   * Gera mensagens motivacionais personalizadas baseadas no progresso do aluno.
   */
  public static generateMotivationMessage(data: MotivationData): string {
    const nome = data.alunoNome || "Aluno";
    
    if (data.evolucao > 10) {
      return `Incrível, ${nome}! Você teve uma evolução de ${data.evolucao}% nos últimos dias. O seu esforço está dando resultados reais. Continue assim!`;
    }

    if (data.evolucao > 0) {
      return `Muito bom, ${nome}! Você evoluiu ${data.evolucao}% recentemente. Cada pequeno passo conta na sua jornada de aprendizado.`;
    }

    if (data.dificuldadeAtual) {
      return `Ei, ${nome}, percebi que você está enfrentando dificuldades em "${data.dificuldadeAtual}". Não desanime, isso faz parte do processo de aprendizado. Que tal revisarmos os conceitos básicos desse tópico juntos?`;
    }

    return "Continue praticando, ${nome}. Cada exercício resolvido é um degrau a mais rumo ao domínio do conteúdo. Estou aqui para ajudar!";
  }

  /**
   * Sugere uma "Micro-Missão" para manter o engajamento.
   */
  public static suggestMission(data: MotivationData): { title: string; steps: string[] } {
    if (data.dificuldadeAtual) {
      return {
        title: `Missão: Superar ${data.dificuldadeAtual}`,
        steps: [
          "Revisar o conceito principal por 10 minutos",
          "Resolver 3 exercícios guiados passo a passo",
          "Tentar explicar o conceito para a IA com suas palavras",
          "Concluir um desafio prático de nível iniciante"
        ]
      };
    }

    return {
      title: "Missão de Evolução Diária",
      steps: [
        "Escolher um novo tópico para explorar",
        "Resolver 5 questões do Banco de Questões",
        "Registrar uma dúvida ou insight no seu diário",
        "Participar de um mini-game de fixação"
      ]
    };
  }
}
