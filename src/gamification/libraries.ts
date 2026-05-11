import { 
  Terminal, 
  Code2, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Award, 
  Rocket, 
  Heart, 
  BrainCircuit, 
  Bot, 
  LifeBuoy, 
  Gem, 
  Search, 
  Layout, 
  Database, 
  Key,
  ShieldAlert,
  Server,
  Lock,
  Cpu,
  Monitor,
  MousePointer2,
  Bug,
  Lightbulb,
  Workflow
} from 'lucide-react';

export type Rarity = 'COMUM' | 'INCOMUM' | 'RARA' | 'EPICA' | 'LENDARIA';

export interface GamificationItem {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  cursoRelated?: string;
  raridade: Rarity;
  pontos: number;
  xp: number;
  tokensIA: number;
  message: string;
  iconName: string; // Ref to Lucide icons
}

export const CATEGORIES = {
  INICIO: 'Início de Jornada',
  PROGRESSO: 'Progresso Técnico',
  CONSISTENCIA: 'Consistência',
  SUPERACAO: 'Superação',
  TRILHAS: 'Trilhas',
  DESAFIOS: 'Desafios',
  BOSS: 'Boss Challenge',
  EVOLUCAO: 'Evolução',
  COLABORACAO: 'Colaboração',
  IA: 'Uso Produtivo da IA',
  RECUPERACAO: 'Recuperação',
  EXCELENCIA: 'Excelência',
  DOMINIO_CONHECIMENTO: 'Domínio por Conhecimento Técnico',
  DOMINIO_CAPACIDADE: 'Domínio por Capacidade Técnica'
};

export const UNIVERSAL_BADGES: GamificationItem[] = [
  {
    id: 'uni-1',
    nome: 'Primeiro Passo',
    descricao: 'Concluiu o primeiro simulado na plataforma.',
    categoria: CATEGORIES.INICIO,
    raridade: 'COMUM',
    pontos: 100,
    xp: 200,
    tokensIA: 5,
    message: 'A jornada de mil códigos começa com o primeiro log!',
    iconName: 'Zap'
  },
  {
    id: 'uni-2',
    nome: 'Sentinela de Fogo',
    descricao: 'Manteve um streak de 7 dias consecutivos.',
    categoria: CATEGORIES.CONSISTENCIA,
    raridade: 'RARA',
    pontos: 500,
    xp: 1000,
    tokensIA: 20,
    message: 'O fogo da constância arde forte em você!',
    iconName: 'Flame'
  },
  {
    id: 'uni-3',
    nome: 'Fênix Digital',
    descricao: 'Concluiu um plano de recuperação com 100% de aproveitamento.',
    categoria: CATEGORIES.RECUPERACAO,
    raridade: 'EPICA',
    pontos: 800,
    xp: 1500,
    tokensIA: 30,
    message: 'Das cinzas do erro ao topo do domínio!',
    iconName: 'Rocket'
  },
  {
    id: 'uni-4',
    nome: 'Mestre da Automação',
    descricao: 'Criou sua própria meta inteligente com ajuda da IA.',
    categoria: CATEGORIES.IA,
    raridade: 'INCOMUM',
    pontos: 200,
    xp: 400,
    tokensIA: 50,
    message: 'IA e Humano em perfeita sintonia técnica.',
    iconName: 'Bot'
  }
];

export const DEV_SYSTEMS_BADGES: GamificationItem[] = [
  {
    id: 'dev-1',
    nome: 'Arquiteto de Algoritmos',
    descricao: 'Resolveu um desafio de lógica complexa (Nível Hard).',
    categoria: CATEGORIES.PROGRESSO,
    cursoRelated: 'Desenvolvimento de Sistemas',
    raridade: 'RARA',
    pontos: 600,
    xp: 1200,
    tokensIA: 15,
    message: 'Seus algoritmos são pura arte computacional!',
    iconName: 'BrainCircuit'
  },
  {
    id: 'dev-2',
    nome: 'Caçador de Bugs',
    descricao: 'Encontrou e corrigiu 10 erros sintáticos em laboratórios.',
    categoria: CATEGORIES.DOMINIO_CAPACIDADE,
    cursoRelated: 'Desenvolvimento de Sistemas',
    raridade: 'INCOMUM',
    pontos: 300,
    xp: 600,
    tokensIA: 10,
    message: 'Nenhum bug escapa do seu olhar clínico!',
    iconName: 'Bug'
  },
  {
    id: 'dev-3',
    nome: 'Dominador do CRUD',
    descricao: 'Implementou um sistema completo de Create, Read, Update e Delete.',
    categoria: CATEGORIES.DOMINIO_CONHECIMENTO,
    cursoRelated: 'Desenvolvimento de Sistemas',
    raridade: 'RARA',
    pontos: 500,
    xp: 1000,
    tokensIA: 20,
    message: 'Os dados estão sob seu controle total.',
    iconName: 'Database'
  }
];

export const INFO_INTERNET_BADGES: GamificationItem[] = [
  {
    id: 'info-1',
    nome: 'Guardião do CSS',
    descricao: 'Criou um layout totalmente responsivo sem usar frameworks externos.',
    categoria: CATEGORIES.PROGRESSO,
    cursoRelated: 'Informática para Internet',
    raridade: 'RARA',
    pontos: 550,
    xp: 1100,
    tokensIA: 15,
    message: 'Flexbox e Grid são seus melhores amigos!',
    iconName: 'Layout'
  },
  {
    id: 'info-2',
    nome: 'Frontend Ninja',
    descricao: 'Integrou 3 APIs externas em uma única interface.',
    categoria: CATEGORIES.DOMINIO_CAPACIDADE,
    cursoRelated: 'Informática para Internet',
    raridade: 'EPICA',
    pontos: 1000,
    xp: 2000,
    tokensIA: 40,
    message: 'Sua interface é rápida, fluida e conectada.',
    iconName: 'Zap'
  }
];

export const CYBER_SECURITY_BADGES: GamificationItem[] = [
  {
    id: 'cyber-1',
    nome: 'Sentinela Digital',
    descricao: 'Configurou um firewall com 0 brechas em simulação SOC.',
    categoria: CATEGORIES.PROGRESSO,
    cursoRelated: 'Técnico em Cibersegurança',
    raridade: 'EPICA',
    pontos: 900,
    xp: 1800,
    tokensIA: 35,
    message: 'O sistema está seguro sob sua vigilância.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'cyber-2',
    nome: 'Analista SOC',
    descricao: 'Identificou 5 padrões de ataque em logs de servidor.',
    categoria: CATEGORIES.DOMINIO_CONHECIMENTO,
    cursoRelated: 'Técnico em Cibersegurança',
    raridade: 'RARA',
    pontos: 700,
    xp: 1400,
    tokensIA: 25,
    message: 'Você vê o invisível no fluxo de dados.',
    iconName: 'Search'
  }
];

export const LINUX_SECURITY_BADGES: GamificationItem[] = [
  {
    id: 'linux-1',
    nome: 'Terminal Master',
    descricao: 'Executou 100 comandos no CLI sem usar a interface gráfica.',
    categoria: CATEGORIES.CONSISTENCIA,
    cursoRelated: 'Linux e Cibersegurança',
    raridade: 'RARA',
    pontos: 600,
    xp: 1200,
    tokensIA: 20,
    message: 'O Bash é sua linguagem nativa.',
    iconName: 'Terminal'
  },
  {
    id: 'linux-2',
    nome: 'Mestre do Hardening',
    descricao: 'Aplicou políticas de segurança restritivas em Kernel Linux.',
    categoria: CATEGORIES.BOSS,
    cursoRelated: 'Linux e Cibersegurança',
    raridade: 'LENDARIA',
    pontos: 2000,
    xp: 5000,
    tokensIA: 100,
    message: 'Você forjou um Kernel inquebrável!',
    iconName: 'Lock'
  }
];

export const ALL_BADGES = [
  ...UNIVERSAL_BADGES,
  ...DEV_SYSTEMS_BADGES,
  ...INFO_INTERNET_BADGES,
  ...CYBER_SECURITY_BADGES,
  ...LINUX_SECURITY_BADGES
];
