import { 
  Swords, 
  ShieldAlert, 
  Database, 
  Terminal, 
  Globe, 
  Zap, 
  Trophy, 
  Cpu, 
  Lock, 
  Cpu as CpuIcon,
  Flame,
  Bomb,
  Code2,
  Bug,
  Layout,
  Search,
  Key,
  ShieldCheck
} from 'lucide-react';

export interface BossChallenge {
  id: string;
  titulo: string;
  contexto: string;
  missaoPrincipal: string;
  narrativa: string;
  etapas: string[];
  conhecimentos: string[];
  capacidades: string[];
  criteriosDesbloqueio: string;
  criteriosAvaliacao: string[];
  tempoSugerido: string;
  dificuldade: 'EPICA' | 'LENDARIA';
  cursoRelated: string;
  xpRecompensa: number;
  pontosRecompensa: number;
  tokensIARecompensa: number;
  badgeId: string;
  iconName: string;
  corTema: string; // Ex: 'red', 'indigo', 'emerald'
}

export const BOSS_CHALLENGES: BossChallenge[] = [
  {
    id: 'boss-dev-1',
    titulo: 'O Arquiteto do Legado',
    contexto: 'Uma fintech parceira perdeu o código-fonte de um módulo crítico e você recebeu os binários decompilados e um banco de dados corrompido.',
    missaoPrincipal: 'Corrigir 5 bugs críticos de lógica, reconstruir a camada de persistência e expor uma API segura para o dashboard administrativo.',
    narrativa: 'O tempo está correndo. Cada segundo de inatividade custa milhares de reais. Você é a última esperança de recuperar os dados dos clientes.',
    etapas: [
      'Análise de Logs e Identificação dos 5 NullPointerExceptions.',
      'Refatoração da Classe DatabaseConnection para suportar Pool de Conexões.',
      'Implementação de Validação de Input para prevenir SQL Injection.',
      'Construção dos Endpoints GET e POST autenticados via JWT.',
      'Documentação técnica da solução via Swagger.'
    ],
    conhecimentos: ['Java/Spring', 'SQL Avançado', 'Padrões de Projeto', 'Segurança de APIs'],
    capacidades: ['Analisar códigos legados', 'Otimizar consultas de banco de dados', 'Implementar segurança em nível de aplicação'],
    criteriosDesbloqueio: 'Concluir a Trilha de Lógica e a Trilha de Banco de Dados com aproveitamento > 85%.',
    criteriosAvaliacao: [
      'Código limpo e documentado.',
      'API respondendo com código 200 em testes de estresse.',
      'Nenhum dado sensível exposto em exceções.'
    ],
    tempoSugerido: '120 minutos',
    dificuldade: 'EPICA',
    cursoRelated: 'Desenvolvimento de Sistemas',
    xpRecompensa: 5000,
    pontosRecompensa: 2000,
    tokensIARecompensa: 100,
    badgeId: 'dev-boss-master',
    iconName: 'Code2',
    corTema: 'indigo'
  },
  {
    id: 'boss-info-1',
    titulo: 'Ecom-Forge: O Portal da Convergência',
    contexto: 'Uma startup de impacto social precisa lançar seu marketplace amanhã, mas o frontend atual está lento e não funciona em dispositivos mobile.',
    missaoPrincipal: 'Recriar a interface do checkout usando Tailwind CSS, garantindo performance nota 100 no Lighthouse e integração fluida com API de pagamento.',
    narrativa: 'Os pequenos produtores dependem deste portal para vender suas safras. Sua missão é criar uma experiência de compra tão fluida que ninguém desista no carrinho.',
    etapas: [
      'Converter o design de alta fidelidade (Figma) em HTML/Tailwind responsivo.',
      'Otimizar imagens e assets para carregamento instantâneo via CDN.',
      'Implementar o Carrinho de Compras em State Management (Redux/Zustand).',
      'Validar formulário de cartão de crédito com máscaras e feedback em tempo real.',
      'Fazer o deploy contínuo via Vercel/Netlify.'
    ],
    conhecimentos: ['React', 'Tailwind CSS', 'State Management', 'Web Vitals'],
    capacidades: ['Desenvolver interfaces responsivas', 'Otimizar UX para conversão', 'Integrar serviços de terceiros'],
    criteriosDesbloqueio: 'Concluir a Trilha Frontend e a Trilha de UX Design.',
    criteriosAvaliacao: [
      'Design fiel ao protótipo.',
      'Tempo de carregamento < 1.5s.',
      'Funcionamento impecável em iPhone e Android.'
    ],
    tempoSugerido: '90 minutos',
    dificuldade: 'EPICA',
    cursoRelated: 'Informática para Internet',
    xpRecompensa: 4500,
    pontosRecompensa: 1800,
    tokensIARecompensa: 80,
    badgeId: 'info-boss-master',
    iconName: 'Globe',
    corTema: 'emerald'
  },
  {
    id: 'boss-cyber-1',
    titulo: 'Operação Sentinela: O Intruso Fantasma',
    contexto: 'O sensor do SOC detectou um aumento incomum de tráfego na porta 445 e credenciais administrativas sendo testadas em massa.',
    missaoPrincipal: 'Identificar a origem do ataque, isolar o servidor infectado, extrair os binários do malware e recomendar o plano de contenção total.',
    narrativa: 'O invasor já está dentro. Ele está movendo-se lateralmente pela rede. Se ele chegar ao Controlador de Domínio, o jogo acabou. Pare-o!',
    etapas: [
      'Analise do tráfego PCAP para identificar o IP de origem.',
      'Identificação da conta de usuário comprometida via logs do Windows Event Viewer.',
      'Isolamento de Redes via regras de firewall (VLAN isolation).',
      'Identificar o tipo de ataque (Ransomware, Botnet ou Exfiltração).',
      'Escrita de Relatório de Incidente (Post-Mortem).'
    ],
    conhecimentos: ['Protocolos TCP/IP', 'Logs de Sistema', 'Firewalls', 'Incident Response'],
    capacidades: ['Analisar pacotes de rede', 'Interpretar eventos de segurança', 'Elaborar planos de resposta a incidentes'],
    criteriosDesbloqueio: 'Mínimo de 3000 XP na trilha de Cibersegurança e Badge "Analista SOC".',
    criteriosAvaliacao: [
      'Velocidade de contenção do incidente.',
      'Precisão na identificação do vetor de ataque.',
      'Qualidade técnica das recomendações de hardening.'
    ],
    tempoSugerido: '150 minutos',
    dificuldade: 'LENDARIA',
    cursoRelated: 'Técnico em Cibersegurança',
    xpRecompensa: 8000,
    pontosRecompensa: 3500,
    tokensIARecompensa: 200,
    badgeId: 'cyber-boss-master',
    iconName: 'ShieldAlert',
    corTema: 'red'
  },
  {
    id: 'boss-linux-1',
    titulo: 'Fortaleza Kernel: O Hardening Final',
    contexto: 'Um servidor Ubuntu 22.04 foi configurado por um estagiário sem experiência. O SSH permite login de root, não há firewall e o usuário Apache tem permissões sudo.',
    missaoPrincipal: 'Transformar este servidor em uma fortaleza Linux impenetrável através de hardening completo de kernel, rede e permissões.',
    narrativa: 'Este servidor hospeda segredos de estado. Ele está na internet aberta sendo atacado por bots neste exato momento. Mostre por que você é um Terminal Master.',
    etapas: [
      'Configuração do SSH (Desativar Root, Mudar Porta, Chaves Públicas).',
      'Configuração de Firewall (UFW/IPTables) - Apenas o estritamente necessário.',
      'Ajuste das Permissões de Arquivos (id, chmod, chown) e exclusão de contas inativas.',
      'Implementação de Monitoramento (Fail2Ban e Logwatch).',
      'Configuração de Hardening de Kernel via sysctl.conf.'
    ],
    conhecimentos: ['Linux Admin', 'Bash Scripting', 'Segurança de SO', 'Redes Linux'],
    capacidades: ['Administrar sistemas Linux via CLI', 'Implementar políticas de segurança restritivas', 'Monitorar integridade do sistema'],
    criteriosDesbloqueio: 'Badge "Terminal Master" e conclusão de 50 Quizzes de Linux.',
    criteriosAvaliacao: [
      'Script de hardening executável.',
      'Servidor aprovado no scan de vulnerabilidades (Lynis).',
      'Sem erros de serviço após reinicialização.'
    ],
    tempoSugerido: '100 minutos',
    dificuldade: 'LENDARIA',
    cursoRelated: 'Linux e Cibersegurança',
    xpRecompensa: 7500,
    pontosRecompensa: 3000,
    tokensIARecompensa: 150,
    badgeId: 'linux-boss-master',
    iconName: 'Terminal',
    corTema: 'slate'
  }
];
