import { 
  FileCode2, 
  Search, 
  Terminal, 
  Layout, 
  ShieldCheck, 
  Bug, 
  Wrench, 
  Zap, 
  Database, 
  Lock,
  Globe,
  Settings,
  AlertTriangle,
  Flame
} from 'lucide-react';

export type ChallengeLevel = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO' | 'CORRETIVO' | 'BONUS';
export type TechCourse = 'DESENVOLVIMENTO' | 'INTERNET' | 'CIBERSEGURANCA' | 'LINUX';

export interface PracticalChallenge {
  id: string;
  titulo: string;
  descricao: string;
  curso: TechCourse;
  trilha: string;
  fase: number;
  dificuldade: ChallengeLevel;
  conhecimentos: string[];
  capacidades: string[];
  objetivo: string;
  criterioConclusao: string;
  xpReward: number;
  tokenReward: number;
  iconName: string;
  feedbackSucesso: string;
}

export const PRACTICAL_CHALLENGES: PracticalChallenge[] = [
  // --- DESENVOLVIMENTO DE SISTEMAS ---
  {
    id: 'dev-beg-1',
    titulo: 'O Bug do if Perdido',
    descricao: 'Um algoritmo de cálculo de desconto está aplicando 50% para todos os usuários. Localize o erro na estrutura condicional e corrija.',
    curso: 'DESENVOLVIMENTO',
    trilha: 'Lógica de Programação',
    fase: 1,
    dificuldade: 'INICIANTE',
    conhecimentos: ['Estruturas Condicionais', 'Operadores Lógicos'],
    capacidades: ['Depurar algoritmos simples', 'Identificar erros de sintaxe e lógica'],
    objetivo: 'Garantir que apenas usuários Premium recebam o desconto de 50%.',
    criterioConclusao: 'Teste unitário aprova 3 cenários diferentes de desconto.',
    xpReward: 300,
    tokenReward: 5,
    iconName: 'Bug',
    feedbackSucesso: 'Excelente! Você domina a lógica condicional como um verdadeiro dev!'
  },
  {
    id: 'dev-int-1',
    titulo: 'Refatoração Express',
    descricao: 'Este método possui 50 linhas e faz 3 coisas ao mesmo tempo. Aplique o princípio de responsabilidade única (SRP).',
    curso: 'DESENVOLVIMENTO',
    trilha: 'Arquitetura de Software',
    fase: 3,
    dificuldade: 'INTERMEDIARIO',
    conhecimentos: ['Clean Code', 'SOLID', 'Refatoração'],
    capacidades: ['Quebrar métodos complexos em funções menores', 'Melhorar legibilidade do código'],
    objetivo: 'Dividir o método em três funções específicas e testáveis.',
    criterioConclusao: 'Código refatorado passa no linter e mantém comportamento original.',
    xpReward: 800,
    tokenReward: 15,
    iconName: 'Wrench',
    feedbackSucesso: 'Seu código agora é uma obra de arte limpa e sustentável!'
  },

  // --- INFORMÁTICA PARA INTERNET ---
  {
    id: 'info-beg-1',
    titulo: 'Resgate do Layout Quebrado',
    descricao: 'O menu lateral está sobrepondo o conteúdo principal em resoluções menores. Ajuste o Flexbox ou Grid.',
    curso: 'INTERNET',
    trilha: 'Frontend Básico',
    fase: 2,
    dificuldade: 'INICIANTE',
    conhecimentos: ['CSS Flexbox', 'Media Queries'],
    capacidades: ['Corrigir problemas de layout responsivo', 'Manipular propriedades de display'],
    objetivo: 'Garantir que o menu se torne um hambúrguer em telas menores que 768px.',
    criterioConclusao: 'Viewport responsiva validada via DevTools em 3 dispositivos.',
    xpReward: 350,
    tokenReward: 8,
    iconName: 'Layout',
    feedbackSucesso: 'Interface resgatada! Seus usuários mobile agradecem.'
  },
  {
    id: 'info-adv-1',
    titulo: 'O Mestre dos Formulários',
    descricao: 'Crie uma validação complexa que verifica força de senha, formato de e-mail e CPF real sem usar bibliotecas externas.',
    curso: 'INTERNET',
    trilha: 'JavaScript Avançado',
    fase: 5,
    dificuldade: 'AVANCADO',
    conhecimentos: ['RegEx', 'DOM Manipulation', 'Event Listeners'],
    capacidades: ['Implementar lógicas de validação robustas', 'Tratar erros de input em tempo real'],
    objetivo: 'Impedir o envio do formulário enquanto todos os campos não estiverem válidos.',
    criterioConclusao: 'Passar por 5 testes de entrada maliciosa/inválida.',
    xpReward: 1200,
    tokenReward: 30,
    iconName: 'Settings',
    feedbackSucesso: 'Uau! Seus formulários são a prova de erros. Impenetrável!'
  },

  // --- CIBERSEGURANÇA ---
  {
    id: 'cyber-beg-1',
    titulo: 'Triagem de Log Suspeito',
    descricao: 'Analise este log do Apache e identifique o endereço IP que tentou realizar um Bruteforce no /admin.',
    curso: 'CIBERSEGURANCA',
    trilha: 'Fundamentos de Segurança',
    fase: 1,
    dificuldade: 'INICIANTE',
    conhecimentos: ['Logs de Servidor', 'Protocolo HTTP', 'Vulnerabilidades de Autenticação'],
    capacidades: ['Interpretar mensagens de log', 'Identificar padrões de ataque de força bruta'],
    objetivo: 'Listar o IP atacante e o número de tentativas falhas.',
    criterioConclusao: 'Identificação correta do IP e timestamp do ataque.',
    xpReward: 400,
    tokenReward: 10,
    iconName: 'Search',
    feedbackSucesso: 'Olho de águia! Nenhum intruso passará despercebido por você.'
  },
  {
    id: 'cyber-cor-1',
    titulo: 'Resgate do Site Invasão',
    descricao: 'Desafio corretivo: Este site foi desfigurado (Defacement). Identifique a falha que permitiu o upload do arquivo malicioso.',
    curso: 'CIBERSEGURANCA',
    trilha: 'Segurança Web',
    fase: 4,
    dificuldade: 'CORRETIVO',
    conhecimentos: ['File Upload Vulnerabilities', 'RCE (Remote Code Execution)'],
    capacidades: ['Realizar forense pós-incidente', 'Propor medidas de mitigação imediatas'],
    objetivo: 'Encontrar o script webshell escondido e fechar a brecha de upload.',
    criterioConclusao: 'Vulnerabilidade removida e sistema restaurado ao estado íntegro.',
    xpReward: 1500, // XP alto por ser corretivo/especial
    tokenReward: 40,
    iconName: 'AlertTriangle',
    feedbackSucesso: 'Sistema restaurado! Você é o herói da infraestrutura hoje.'
  },

  // --- LINUX ---
  {
    id: 'linux-beg-1',
    titulo: 'A Maldição do chmod 777',
    descricao: 'Um estagiário deu permissão total recursiva no /var/www. Reestabeleça as permissões mínimas necessárias.',
    curso: 'LINUX',
    trilha: 'Administração de Sistemas',
    fase: 2,
    dificuldade: 'INICIANTE',
    conhecimentos: ['Linux Permissions', 'User Groups'],
    capacidades: ['Configurar permissões de arquivos via CLI', 'Aplicar o princípio do menor privilégio'],
    objetivo: 'Arquivos em 644 e pastas em 755 para o usuário www-data.',
    criterioConclusao: 'Verificação via ls -l confirma as permissões corretas.',
    xpReward: 300,
    tokenReward: 5,
    iconName: 'Terminal',
    feedbackSucesso: 'Permissões corrigidas! O servidor está seguro novamente.'
  },
  {
    id: 'linux-bon-1',
    titulo: 'Automação Sniper (Bônus)',
    descricao: 'Crie um script em Bash que monitora o uso de CPU e envia um alerta se passar de 90% por mais de 5 minutos.',
    curso: 'LINUX',
    trilha: 'Shell Scripting',
    fase: 6,
    dificuldade: 'BONUS',
    conhecimentos: ['Bash Scripting', 'Process Management', 'Linux Monitoring'],
    capacidades: ['Automatizar tarefas críticas de administração', 'Criar soluções de monitoramento leves'],
    objetivo: 'Gerar um log persistente de alertas e notificar o admin.',
    criterioConclusao: 'Script executado com sucesso simulando carga alta.',
    xpReward: 2000,
    tokenReward: 50,
    iconName: 'Zap',
    feedbackSucesso: 'Script de elite! Você agora tem olhos em todo o sistema.'
  }
];
