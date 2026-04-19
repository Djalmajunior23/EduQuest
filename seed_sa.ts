import { saService } from './src/services/saService';

const modelSA = {
  titulo: "SISTEMA DE GESTÃO DE MANUTENÇÃO (SGM) - INDÚSTRIA 4.0",
  contexto: "A empresa 'Metalúrgica Futuro' está passando por um processo de digitalização. Atualmente, todas as ordens de serviço de manutenção são feitas em papel, o que gera atrasos, perda de dados e falta de controle sobre o tempo de inatividade das máquinas.",
  problema_desafio: "Você e sua equipe foram contratados para desenvolver o protótipo funcional de um Dashboard Web de Gestão de Manutenção. O sistema deve permitir que operadores enviem alertas de falha e que a equipe de manutenção visualize e priorize as correções em tempo real.",
  objetivo_geral: "Desenvolver uma aplicação web CRUD completa com integração de banco de dados em tempo real utilizando React e Firebase.",
  objetivos_especificos: [
    "Modelar o banco de dados NoSQL para suportar Máquinas, Operadores e Ordens de Serviço.",
    "Implementar autenticação de usuários diferenciada por nível de acesso (Operador vs Manutenção).",
    "Desenvolver uma interface responsiva focada em usabilidade industrial.",
    "Integrar notificações em tempo real para alertas de falha crítica."
  ],
  entregas: [
    { descricao: "Documento de Modelagem de Dados (MER/DER NoSQL)", prazo: "Semana 1" },
    { descricao: "Protótipo de Interface (Figma ou Similar)", prazo: "Semana 2" },
    { descricao: "Link do Repositório Git com aplicação funcional", prazo: "Semana 4" }
  ],
  criterios_avaliacao: [
    "Funcionalidade: O sistema realiza as operações de CRUD sem erros.",
    "Segurança: Rotas protegidas e permissões de banco de dados configuradas.",
    "UX/UI: Interface intuitiva para uso em tablets/dispositivos móveis no chão de fábrica."
  ],
  evidencias: [
    "Printscreens das telas do sistema.",
    "Vídeo de demonstração do fluxo completo (Abertura de chamado -> Conclusão).",
    "Código fonte documentado."
  ],
  ucId: "web_dev",
  conhecimentoTecnicoIds: ["react_basics", "firebase_auth", "firestore_crud"],
  capacidadeTecnicaIds: ["analise_requisitos", "desenvolvimento_frontend", "integracao_api"],
  recursos_necessarios: [
    "Computador com VS Code e Node.js instalado.",
    "Acesso à internet.",
    "Conta no Firebase."
  ],
  cronograma: "4 Semanas intensivas com checkpoints semanais de feedback.",
  orientacoes_aluno: "Trabalhem em squads de 3 pessoas. Foquem primeiro no MVP (Mínimo Produto Viável) antes de adicionar perfumarias visuais. Lembrem-se que no chão de fábrica, a clareza é mais importante que o design artístico.",
  orientacoes_professor: "Acompanhe as dailies de cada squad. Intervenha se a modelagem NoSQL estiver ficando muito complexa ou relacional demais. Incentive o uso de hooks personalizados para gerenciar o estado global da aplicação.",
  status: 'PUBLISHED',
  isTemplate: true,
  createdBy: "SYSTEM_SEED"
};

async function seed() {
  console.log("Iniciando semeadura da SA Modelo...");
  try {
    // Usamos o serviço diretamente
    const id = await saService.createSA(modelSA as any);
    console.log(`SA Modelo criada com sucesso! ID: ${id}`);
    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar SA Modelo:", error);
    process.exit(1);
  }
}

// Para rodar este script, precisaríamos de um runner que suporte TS e imports
// Como não temos um comando direto de shell para rodar scripts TS isolados que dependem do projeto,
// vou injetar esse código temporariamente em um useEffect no Dashboard para ser executado uma vez.
