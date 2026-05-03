// src/services/edujarvis/AgentConfiguration.ts

export interface AgentResponsibility {
  name: string;
  type: string;
  description: string;
  responsibilities: string[];
  communicationWithOrchestrator: string;
}

export const EduJarvisAgentConfig: Record<string, AgentResponsibility> = {
  TUTOR: {
    name: 'TutorIA',
    type: 'TUTOR',
    description: 'Assistente pedagógico focado em tirar dúvidas e auxiliar diretamente os alunos.',
    responsibilities: [
      'Responder dúvidas dos alunos com base no material didático e conteúdo formativo.',
      'Fornecer explicações didáticas passo a passo (não apenas dar a resposta pronta).',
      'Auxiliar no entendimento de conceitos complexos usando métodos socráticos.',
      'Adaptar a linguagem ao nível de conhecimento do aluno diagnosticado pelo sistema.'
    ],
    communicationWithOrchestrator: 'Recebe do Orquestrador a intenção classificada como "student_question". Retorna a explicação pedagógica. Requisita metadados do aluno de forma assíncrona (ex: memória do AdaptiveLearningEngine).'
  },
  PROFESSOR: {
    name: 'ProfessorIA',
    type: 'PROFESSOR',
    description: 'Copiloto de ensino focado em aumento de produtividade docente.',
    responsibilities: [
      'Criar planos de aula (Lesson Plans) e roteiros de aprendizagem baseados na BNCC ou diretrizes da escola.',
      'Sugerir metodologias ativas como sala de aula invertida e PBL (Project-Based Learning).',
      'Elaborar estudos de caso, rubricas de avaliação e simulações para turmas.',
      'Gerar atividades práticas com base na ementa da Unidade Curricular.'
    ],
    communicationWithOrchestrator: 'Recebe requisições de geração de conteúdo do Orquestrador (intenções limitadas a "teacher_content_generation"). Interage ativamente com o RAG (Retrieval-Augmented Generation) para manter contexto.'
  },
  ANALYST: {
    name: 'AnalystIA',
    type: 'ANALYST',
    description: 'Motor analítico voltado para BI e diagnósticos de dados educacionais.',
    responsibilities: [
      'Processar dados brutos (notas, engajamento e frequência) de turmas e alunos específicos.',
      'Encontrar padrões de deficiência em determinados conceitos formativos da sala.',
      'Gerar relatórios textuais claros (Narrative BI) para docentes e coordenadores.',
      'Prever tendências de risco combinando informações transacionais de avaliações.'
    ],
    communicationWithOrchestrator: 'Acionado pelo Orquestrador em requisições de "performance_analysis". Recebe o ID da Turma ou Aluno, busca dados transacionais na base (ex: Analytics/Postgres) e retorna sínteses naturais (NLG).'
  },
  RECOMMENDER: {
    name: 'RecommenderIA',
    type: 'RECOMMENDER',
    description: 'Motor voltado à emissão de trilhas de estudo e ações preditivas personalizadas.',
    responsibilities: [
      'Recomendar a próxima melhor ação (Next-Best-Action) de estudo com base nas lacunas do aluno.',
      'Sugerir pílulas de conhecimento, vídeos ou artigos com base em performance passada.',
      'Montar planos de recuperação focados quando ativado em conjunto com eventos de "recuperacao".'
    ],
    communicationWithOrchestrator: 'Atua sobre pedidos de "study_recommendation". Puxa ativamente o perfil e estado do Gêmeo Digital (Digital Twin) para compor a melhor trilha e retorna o roteiro estruturado.'
  },
  GAME: {
    name: 'GameIA',
    type: 'GAME',
    description: 'Gestor de gamificação, missões e storytelling de engajamento.',
    responsibilities: [
      'Transformar atividades normais da escola em missões com storytelling e narrativa (ex RPG educacional).',
      'Propor desafios, distribuição de XP (experiência), badges (conquistas) e moedas virtuais.',
      'Mediar feedback de recompensas e gerar mensagens instantâneas de motivação atreladas ao contexto lúdico.'
    ],
    communicationWithOrchestrator: 'Acionado para "gamification" ou "quest", formatando a UX do estudante. Conecta com os agentes recomendadores e repassa a mecânica formatada de volta ao Orquestrador.'
  },
  GUARD: {
    name: 'GuardIA',
    type: 'GUARD',
    description: 'Agente de moderação neural e segurança lógica da comunicação.',
    responsibilities: [
      'Garantir alinhamento de conduta ética em todas as entradas de prompts (bloqueio de assédios, palavras ofensivas).',
      'Impedir burlas (hacking prompts, extração de prompts sistêmicos ou "colas" em avaliações/certificadores).',
      'Sanitizar conteúdo gerado antes da exibição ao aluno para proteger a infraestrutura e mitigar hallucination de caráter crítico.'
    ],
    communicationWithOrchestrator: 'Atua no pre-flight das mensagens. Se o Orquestrador ou Regex detectam risco (confiança pre-estabelecida), o GuardIA intervém e sobrescreve o fluxo, finalizando a interação com mensagem de bloqueio ("security_block").'
  }
};
