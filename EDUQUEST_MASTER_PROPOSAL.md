# Proposta Mestre: Ecossistema de Gamificação EduQuest SENAI

Este documento consolida a arquitetura, regras e roadmap para a implementação do ecossistema completo de gamificação adaptativa, projetado para maximizar o engajamento técnico e pedagógico dos alunos dos cursos de TI do SENAI.

---

## 1. Arquitetura Geral do Módulo

O módulo **EduQuest** é um sistema distribuído e orientado a eventos que utiliza a IA como o motor de personalização.

### 🧩 Componentes Principais
1.  **Frontend (React/Vite):** Interface de alta fidelidade (Dashboards, Mapas de Trilhas, Arenas).
2.  **Backend Serverless (Firebase):** Firestore para dados em tempo real, Auth para perfis.
3.  **Motor de Automação (n8n):** Orquestrador de eventos que reage a ações do aluno.
4.  **Núcleo de Inteligência (Gemini 1.5):** Analisa o desempenho pedagógico e gera conteúdo adaptativo.
5.  **Analytics & BI:** Camada de processamento de indicadores de engajamento e risco.

---

## 2. Modelagem de Dados (Firebase)

As principais coleções e seus papéis no sistema:

- `gamificacao_perfis`: Estado central do aluno (XP, Level, Streak, Saldo Tokens IA).
- `gamificacao_trilhas`: Definição das jornadas técnicas (ex: Cyber Defender).
- `gamificacao_missoes`: Missões mestres (Diárias, Semanais, Especiais).
- `gamificacao_missoes_adaptativas`: Missões geradas sob demanda pela IA para corrigir gargalos.
- `gamificacao_progresso_missoes`: Tracking individual de completion e métricas de tempo.
- `gamificacao_eventos`: Fila de eventos (logins, erros, acertos) para processamento assíncrono pelo n8n.
- `gamificacao_historico`: Ledger imutável de transações de XP e Tokens para auditoria.

---

## 3. Workflows n8n (Cérebro Operacional)

### W1: O Processador de Eventos (Event Trigger)
- **Evento:** Sempre que um aluno termina um simulado ou acerta uma questão.
- **Ação:** Verifica se alguma missão ativa foi progredida. Se sim, atualiza `progresso_missoes`. Se concluída, dispara o fluxo de premiação.

### W2: O Gerador Adaptativo (AI Engine)
- **Evento:** Acionado após 3 erros seguidos em um mesmo "Conhecimento Técnico".
- **Ação:** Consulta o Gemini passando o histórico do aluno -> IA gera uma missão de reforço específica -> Salva em `missoes_adaptativas` do usuário.

### W3: O Guardião da Streak (Daily Job)
- **Frequência:** Diária às 00:00.
- **Ação:** Identifica quem não logou -> Reseta streaks -> Ativa workflow de reativação (enviar missão "Quick Win" com 2x XP).

---

## 4. Estrutura de Telas (UX/UI)

### 👤 Painel do Aluno (The Nexus)
- **Visual:** Estética "Gamer/Tech" com tons de Slate e Neon.
- **Tabs:** Dashboard, Roadmap, Missions, Arena, Ranking, Shop.
- **Key UX:** Feedback instantâneo após ações (Shake effects, Progress bar animations).

### 👨‍🏫 Painel do Professor (Commander Console)
- **Foco:** Visão tática da turma.
- **Funcionalidades:** Rankings por UC, mapa térmico de engajamento, botão de "Intervenção Manual" (enviar missão bônus para a turma toda).

### ⚙️ Painel Admin (The Architect)
- **Foco:** Economia e Equilíbrio.
- **Funcionalidades:** Ajuste de taxas de inflação de XP, gestão de prêmios reais, configuração de trilhas base.

---

## 5. Motor Adaptativo de Missões (Regras de Decisão)

O motor utiliza a **Taxonomia de Bloom** e as **Competências SENAI** para decidir:

1.  **Nível de Dificuldade:** Alinhado ao `riskLevel` e `currentStage` do aluno no Dossiê.
2.  **Tipo de Saída:**
    *   **Recuperativa:** Atividade simples para reconquistar confiança.
    *   **Desafiadora:** Boss challenges complexos para alunos com alto potencial.
    *   **Revisional:** Spaced Repetition integrada com missões.

---

## 6. Roadmap de Implementação

### Fase 1: Fundação (Semanas 1-2)
- Setup das coleções de base no Firebase.
- Implementação dos serviços de XP e Nivelamento no Frontend.
- Criação das badges fundamentais.

### Fase 2: Automação (Semanas 3-4)
- Integração dos primeiros Webhooks com n8n.
- Fluxo de processamento de pontos básico.
- Rankings globais e por turma.

### Fase 3: Inteligência (Semanas 5-6)
- Ativação do Motor Adaptativo (Gemini + n8n).
- Geração de missões baseadas em erro.
- Dashboard do Professor com insights de engajamento.

### Fase 4: Refinamento & Escala (Semanas 7-8)
- Testes A/B de mecânicas de gamificação.
- Integração com prêmios reais/tokens.
- Dashboards de BI para coordenação.

---

## 7. Regras de Negócio e Compliance Pedagógico

- **Equidade:** A gamificação deve recompensar o ESFORÇO tanto quanto o ACERTO (ex: XP por tempo de estudo consistente).
- **Não-Toxidade:** Rankings focados em superação pessoal e evolução de turma, evitando exposição negativa de alunos em risco.
- **Integração Real:** Missões devem sempre ter um fundo técnico real (ex: "Conserte este bug em C" em vez de "Colete 10 moedas").
