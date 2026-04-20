# Especificações de UI/UX — Módulo de Gamificação SENAI

Este documento define a estrutura completa de telas, componentes e fluxos do módulo de gamificação, projetado para maximizar o engajamento de alunos de tecnologia (Sistemas, Redes, Cyber) do SENAI.

## 1. Mapa de Arquitetura do Módulo

O módulo é acessível via uma aba lateral "Gamificação" ou "Missões", ramificando-se nos seguintes fluxos:

- **🏠 HUB DO ALUNO**
  - Dashboard (Overview)
  - Mapa de Trilhas (Track)
  - Mural de Missões
  - Lab de Desafios & Boss
  - Hall de Conquistas
  - Arena de Rankings
  - Minhas Metas
  - Central de Recompensas
  - Extrato Gamificado

- **📊 HUB DO PROFESSOR**
  - Monitor de Engajamento da Turma
  - Dashboard Pedagógico de Trilhas
  - Radar de Desempenho Saudável

- **⚙️ HUB DE GESTÃO (ADMIN)**
  - Configurador de Economia (XP/Pontos)
  - Editor de Trilhas & Conquistas

---

## 2. Detalhamento de Telas: ALUNO

### 2.1 Dashboard Principal (Home da Gamificação)
- **Objetivo:** Motivacional rápido e guia para a próxima ação.
- **Componentes:**
  - `HeroProfileCard`: Foto, Nível, Barra de XP Circular, Streak animado.
  - `NextActionCard`: "Sua próxima missão expira em 2h" (Botão: Ir agora).
  - `MiniTrackProgress`: Progresso linear da trilha principal.
  - `TokenBalanceWidget`: Saldo de IA com animação de brilho.
- **Mensagem Sugerida:** "O terminal te espera, @Usuário! Pronto para o próximo commit?"

### 2.2 Mapa de Trilhas (Quest Map)
- **Objetivo:** Visualização do currículo como uma aventura.
- **Componentes:**
  - `InteractiveNodes`: Caminho curvo com ícones de fase (Aberto, Bloqueado).
  - `PhaseDetailDrawer`: Ao clicar, mostra conhecimentos técnicos abordados.
  - `BossShadow`: Ícone misterioso ao final da trilha.
- **Estados:** Bloqueado (Opaco), Atual (Pulsante), Concluído (Dourado).

### 2.3 Mural de Missões (Daily/Weekly)
- **Objetivo:** Micro-objetivos para retenção diária.
- **Componentes:**
  - `MissionCard`: Título, Dificuldade, Temporizador (Cronômetro), Recompensa em XP/Tokens.
  - `ProgressRing`: Para missões cumulativas (ex: "Conserte 3 bugs").
- **Filtros:** Diárias, Semanais, IA (Adaptativas).

### 2.4 Lab de Desafios & Boss Challenge
- **Objetivo:** Aplicação técnica intensiva.
- **Componentes:**
  - `ChallengeCard`: Estilo "Cyber" (Brutalista), Dificuldade (Hard/Expert).
  - `RulesPanel`: Requisitos técnicos (ex: "Apenas terminal Linux").
  - `BossEnterButton`: Botão com efeito de "alerta vermelho" para o Boss Challenge.

---

## 3. Detalhamento de Telas: PROFESSOR

### 3.1 Painel de Engajamento da Turma
- **Objetivo:** Visão 360º da saúde gamificada do grupo.
- **Componentes:**
  - `EngagementMatrix`: Gráfico de dispersão (Engajamento x Desempenho).
  - `AtRiskBadge`: Alunos com queda de 50% no streak.
  - `TopSkillChart`: Radar de competências mais dominadas pelo grupo.
- **Ações:** "Enviar incentivo", "Liberar Missão Extra".

### 3.2 Ranking Pedagógico (Não-Tóxico)
- **Objetivo:** Premiar comportamentos positivos.
- **Componentes:**
  - `EvolutionRanking`: Quem mais subiu de XP na semana.
  - `SupportRanking`: Alunos que mais ajudam no fórum/colaboração.
  - `ConsistencyRanking`: Maiores streaks.

---

## 4. Componentes de Interface (Design System)

- **Cards de Missão:** Fundo escuro (Slate 900), bordas neon conforme o curso (Verde para Cyber, Azul para Dev).
- **Barra de XP (The Rail):** Gradiente animado `from-indigo-500 to-purple-500`.
- **Badges:** Vetoriais minimalistas em 3D ou Estilo Pin Metálico.
- **Feedback Visual:**
  - `CelebrateModal`: Overlay transparente com animação de confetti (`canvas-confetti`).
  - `LevelUpScreen`: Tela cheia com paralaxe e resumo de novos recursos desbloqueados.

---

## 5. Fluxos de Navegação

1.  **Exploração:** Aluno entra -> Vê Streak -> Completa Missão Diária -> Barra de XP cresce -> Notificação de Conquista.
2.  **Trilha:** Aluno conclui Fase 3 -> Notificação visual -> Fase 4 desbloqueia -> Boss Challenge fica disponível.
3.  **Tutor:** Professor nota baixa no ranking de consistência -> Clica em "Intervir" -> Sistema gera missão adaptativa via IA para aquele aluno.

---

## 6. UX para Adolescentes (SENAI)

1.  **Instant Gratification:** Toda ação (exercício, login) gera um feedback visual (partículas, som curto).
2.  **Linguagem Técnica:** Usar termos como "Deploy", "Root", "Buffer", "Stack" para integrar ao contexto dos cursos.
3.  **Social Light:** Rankings anônimos (apenas os Top 3 aparecem com nome, outros veem "Você está na posição X").
4.  **Dark Mode Default:** Estética de "Hacker" ou "Gamer" preferencial para turmas de tecnologia.

---

## 7. Integrações e Backend

- **Firebase Firestore:** Escrita de Eventos (`gamificacao_eventos`). Escrita Restrita de Saldo (apenas via Admin/Cloud Functions).
- **n8n:** Processamento da lógica de "Level Up". Se `XP >= XP_Next`, n8n envia push, desbloqueia trilha e credita tokens.
- **IA (Gemini):** Gera o texto motivacional do "Resumo Semanal" baseado nos dados de `historico_xp`.

---
*Roadmap: Semana 1 (Firebase Setup) -> Semana 2 (Dashboard Aluno) -> Semana 3 (Workflows n8n) -> Semana 4 (Módulo Professor).*
