export const SAAS_PLANS = {
  FREE: {
    id: 'plan_free',
    name: 'Free',
    price: 0,
    features: ['Acesso básico a trilhas', 'IA limitada (5 chats/dia)', 'Gamificação básica'],
    limits: { ia_tokens: 100, students: 1, classes: 0 }
  },
  BASIC: {
    id: 'plan_basic',
    name: 'Básico',
    price: 29.90,
    features: ['Trilhas ilimitadas', 'IA assistida (50 chats/dia)', 'Gamificação completa', 'BI Pessoal'],
    limits: { ia_tokens: 1000, students: 1, classes: 0 }
  },
  PRO: {
    id: 'plan_pro',
    name: 'Profissional',
    price: 99.00,
    features: ['Tudo do Básico', 'IA avançada ilimitada', 'BI de Turma', 'Gestão de Alunos'],
    limits: { ia_tokens: 5000, students: 50, classes: 2 }
  },
  INSTITUTIONAL: {
    id: 'plan_institutional',
    name: 'Institucional',
    price: 'Sob consulta',
    features: ['Tudo do Pro', 'Customização White Label', 'Relatórios Administrativos', 'Suporte Prioritário'],
    limits: { ia_tokens: -1, students: 1000, classes: 50 }
  }
};

export const USER_ROLES = {
  STUDENT: 'ALUNO',
  TEACHER: 'PROFESSOR',
  ADMIN: 'ADMIN'
};

export const COURSES = [
  { id: 'ds', label: 'Técnico em Desenvolvimento de Sistemas', icon: 'Code' },
  { id: 'ii', label: 'Informática para Internet', icon: 'Globe' },
  { id: 'cs', label: 'Técnico em Cibersegurança', icon: 'ShieldAlert' },
  { id: 'linux', label: 'Aperfeiçoamento em Linux e Cibersegurança', icon: 'Terminal' }
];
