# Backlog de Telas - Módulo de Gamificação

Este documento detalha o design, funcionalidades e integrações das telas do módulo de gamificação para o **Sistema Interativo de Aprendizagem**.

---

## 1. Visão Geral do Design
- **Estética:** Industrial, High-Tech, Cyber-Inspiration.
- **Tipografia:** Inter (UI), JetBrains Mono (Dados Técnicos).
- **Cores:** Navy Blue (#0F172A), Indigo (#4F46E5), Amber (#F59E0B), Emerald (#10B981).
- **Componentes:** Bordas ultra-arredondadas (3rem), Sombras suaves (shadow-2xl), Micro-interações com `motion`.

---

## 2. Telas do Aluno (Foco em Engajamento)

### 2.1. Dashboard Gamificado (Centro de Operações)
- **Objetivo:** Visão 360º do progresso e acesso rápido a missões.
- **Componentes:**
  - Header Dinâmico (Saudação e Badge de Nível).
  - Barra de XP Circular (Progressão para o próximo nível).
  - Widget de Streak (Ofício Diário).
  - Card de "Próxima Missão Crítica".
  - Mini-Ranking (Posição atual na turma).
- **Ações:** "Iniciar Missão", "Ver Ranking", "Resgatar Recompensa".
- **Integração:** `gamificacao`, `streaks`, `missoes`.

### 2.2. Trilhas Gamificadas (Expedições Tecnológicas)
- **Objetivo:** Visualizar a jornada de aprendizado como um mapa.
- **Componentes:**
  - Timeline Vertical (Nós de trilha desbloqueáveis).
  - Cards de Trilha (Thumbnail, Progresso %, Dificuldade).
  - Filtros por Área (Redes, Programação, Cyber).
- **Ações:** "Abrir Trilha", "Ver Recompensas da Trilha".
- **Integração:** `trilhas_gamificadas`, `progresso_trilha`.

### 2.3. Missões e Desafios (Daily Ops)
- **Objetivo:** Listagem de tarefas curtas e complexas.
- **Componentes:**
  - Lista de Missões Diárias (Timer de expiração).
  - Cards de Desafio (Badge de recompensa, XP alto).
  - Filtro: "Pendentes", "Concluídas", "Expiradas".
- **Ações:** "Aceitar", "Ver Detalhes", "Entregar Evidência".

### 2.4. Ranking (Arena de Elite)
- **Objetivo:** Comparação saudável entre membros.
- **Componentes:**
  - Pódio (Top 3 com avatares estilizados).
  - Lista Infinita (Scroll com posição do usuário fixada no rodapé).
  - Filtros: "Global", "Curso", "Turma".
- **Integração:** `ranking`.

### 2.5. Conquistas e Badges (Cofre de Troféus)
- **Objetivo:** Exibir colecionáveis e reconhecimento.
- **Componentes:**
  - Grid de Badges (Ícones coloridos e em escala de cinza/bloqueados).
  - Drawer de Detalhes (Requisito para desbloquear + Storytelling).
  - Filtro por Raridade: Comum, Raro, Épico, Lendário.

---

## 3. Telas do Professor (Foco em Mentoria)

### 3.1. Painel Gamificado da Turma
- **Objetivo:** Identificar alunos engajados e em risco.
- **Componentes:**
  - Gráfico de Engajamento Semanal (Média de XP da turma).
  - Radar de Competências (Média das UCs).
  - Lista de "Destaques do Dia" e "Alertas de Inatividade".
- **Ações:** "Enviar Estímulo (Notification)", "Conceder Bônus Manual".

### 3.2. Acompanhamento de Trilhas
- **Objetivo:** Ver em qual fase a maioria dos alunos está travada.
- **Componentes:**
  - Funil de Progresso (Quantos alunos em cada fase).
  - Tabela Detalhada (Nome, Progresso, Último Evento).

---

## 4. Telas do Administrador (Foco em Gestão)

### 4.1. Painel Administrativo de Gamificação
- **Objetivo:** Controle global da economia do sistema.
- **Componentes:**
  - KPIs: Total de XP distribuído, Tokens IA emitidos, Taxa de conclusão.
  - Editor de Regras (Multiplicadores de XP, Prazos).

### 4.2. Gestão de Conteúdo Gamificado
- **Objetivo:** Criar e editar Trilhas, Missões e Conquistas.
- **Componentes:**
  - CRUD completo com formulários validados.
  - Preview de Cards (Ver como o aluno verá).

---

## 5. Estados de Sistema (UX Universal)

- **Vazio (Empty Labels):** "Sem missões hoje. Descanso do guerreiro?" (Ilustração minimalista).
- **Carregamento (Loading):** Skeleton screens que simulam a estrutura industrial.
- **Erro:** "Conexão com a rede neural perdida. Tentando reconectar..." (Botão Tentar Novamente).

---

## 6. Fluxo de Navegação (Navigation Graph)
1. **Login** -> **Dashboard**
2. **Dashboard** -> **Missões** -> **Aula/Exercício**
3. **Dashboard** -> **Ranking**
4. **Dashboard** -> **Perfil/Conquistas**
5. **Professor Dashboard** -> **Relatórios da Turma** -> **Ação Disciplinar/Gamificada**

---
*Este backlog serve como especificação técnica para a implementação do frontend em React/Tailwind.*
