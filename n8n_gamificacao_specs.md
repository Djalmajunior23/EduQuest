# Especificações de Workflows n8n — Módulo de Gamificação SENAI

Este documento detalha a arquitetura de automação para o motor de gamificação, integrando o Firebase ao n8n para processamento de eventos, lógica de progressão e engajamento inteligente.

## 1. Arquitetura Geral
O sistema utiliza uma arquitetura **Event-Driven**. A aplicação principal (Frontend/Backend) apenas registra um "Fato" na coleção `gamificacao_eventos`. O n8n monitora essa coleção (ou recebe via Webhook) para processar as consequências gamificadas.

---

## 2. Payloads Padrão de Entrada

Todos os eventos enviados ao n8n devem seguir este contrato:

```json
{
  "eventId": "uuid-v4-unico",
  "eventType": "aluno.concluiu_exercicio",
  "alunoId": "auth_uid_123",
  "cursoId": "curso_ads_01",
  "turmaId": "turma_2024_2",
  "origemId": "exercicio_sql_05",
  "origemTipo": "EXERCICIO",
  "timestamp": "2024-04-20T16:30:00Z",
  "metadata": {
    "score": 100,
    "tentativas": 1,
    "nivelDificuldade": "MÉDIO"
  },
  "securityHash": "sha256-secreto-integridade"
}
```

---

## 3. Workflows Detalhados

### Workflow 1 — Conceder Pontos por Exercício
- **Objetivo:** Bonificar o aluno por atividades curtas e consistentes.
- **Gatilho:** Webhook / Evento `aluno.concluiu_exercicio`.
- **Lógica:** 
  1. Validar `securityHash`.
  2. Verificar se `eventId` já foi processado na coleção `gamificacao_historico`.
  3. Buscar multiplicador de dificuldade em `gamificacao_configuracoes`.
  4. **Firestore Update 1:** Incrementa `xpAtual` e `pontosTotais` em `gamificacao_perfis`.
  5. **Firestore Write 2:** Cria registro em `gamificacao_historico` (Ledger).
  6. **Firestore Write 3:** Atualiza status do `gamificacao_eventos` para `CONCLUIDO`.

### Workflow 2 — Pontuar Simulado (com bônus de performance)
- **Objetivo:** Recompensar desempenho excepcional.
- **Payload Adicional:** `metadata.acertosPercentual`.
- **Lógica:** 
  - Se `acertosPercentual > 90%`, aplicar bônus de 50% de XP extra.
  - Se houve melhora em relação ao simulado anterior (busca em `resultados`), conceder badge "Evolução Constante".

### Workflow 3 — Atualizar Streak de Estudo
- **Gatilho:** Cron Diário (00:01) ou Evento de Primeiro Acesso do Dia.
- **Nós n8n:** Webhook -> Firestore (Get Profile) -> Code Node (Date diff logic) -> Firestore (Update Streak) -> Push (Firebase Cloud Messaging).
- **Lógica:** 
  - Se `ultimoDiaAtivo` for ontem: `streakAtual++`.
  - Se for hoje: manter.
  - Caso contrário: `streakAtual = 1`.
  - Se `streakAtual` bater marcos (7, 15, 30 dias), disparar "Bônus de Tokens de IA".

### Workflow 4 — Verificar e Desbloquear Conquista
- **Objetivo:** Checador de regras em background.
- **Lógica:**
  - Após qualquer ganho de pontos, o n8n verifica o catálogo `gamificacao_conquistas_catalogo`.
  - Compara `pontosTotais` ou contagem de `historico` com a `regraDesbloqueio`.
  - Se atingiu, grava em `usuarios/{id}/conquistasIds` e envia notificação com confete no frontend.

### Workflow 5 — Recalcular Ranking Saudável
- **Gatilho:** Cron (A cada 6 horas).
- **Nós n8n:** Firestore (Query All Profiles) -> Sort Node (Custom logic) -> Firestore (Overwrite `gamificacao_rankings/snapshot`).
- **Observação:** O ranking não é apenas "quem tem mais pontos", mas sim "quem mais evoluiu na semana" para evitar desmotivação dos novos alunos.

### Workflow 6 — Conceder Bônus de Tokens de IA
- **Objetivo:** Alimentar o "saldo" de ajuda da IA.
- **Lógica:** 
  - Validar limites diários em `gamificacao_configuracoes` para evitar inflação.
  - Atualizar `saldoTokensIA` na coleção principal de `usuarios`.

### Workflow 7 — Geração de Missão Diária (IA)
- **Gatilho:** Cron Diário (06:00).
- **Integração IA:** Gemini API.
- **Prompt:** "Baseado no gap de conhecimento do aluno em Linux (verificado no dossiê), gere uma missão de 'Rodar 5 comandos de rede no terminal' com recompensa de 20 XP."
- **Coleção:** Grava em `gamificacao_missoes` e `gamificacao_progresso_missoes`.

### Workflow 10 — Liberar Boss Challenge
- **Objetivo:** Gatekeeper de fim de trilha.
- **Lógica:**
  - Webhook de conclusão de fase.
  - Consulta `progresso_trilha`. Se `fasesConcluidas == fasesTotais`.
  - Atualiza `bossChallengeLiberado = true`.
  - Envia notificação: "O Grande Desafio Final está disponível!".

---

## 4. Integração com IA e Motor Inteligente

| Workflow | Uso da IA |
| :--- | :--- |
| **Geração de Missão** | Personaliza o texto e objetivo com base no curso (Cyber, Developer, etc). |
| **Metas Inteligentes** | O Motor ajusta as metas para serem "desafiadoras mas alcançáveis" (ZDP - Zona de Desenvolvimento Proximal). |
| **Resumo Semanal** | IA gera um parágrafo motivacional interpretando os dados da semana. |

---

## 5. Segurança e Idempotência

1. **Token Secreto:** Todo webhook deve conter o header `X-Webhook-Secret`.
2. **Idempotência:** Antes de qualquer alteração financeira (pontos/tokens), o n8n faz uma busca em `gamificacao_historico` usando o `eventId` como chave. Se retornar algo, o workflow é encerrado com sucesso (No-Op).
3. **Retry:** Se a atualização do Firebase falhar (timeout), o n8n utiliza o nó de **Retry** com backoff exponencial (3 tentativas).

## 6. Coleções Firebase Impactadas (CRUD)

- **Read:** `gamificacao_perfis`, `gamificacao_configuracoes`, `gamificacao_conquistas_catalogo`, `usuarios`.
- **Write:** `gamificacao_perfis`, `gamificacao_historico`, `gamificacao_eventos`, `gamificacao_notificacoes`, `gamificacao_progresso_trilhas`, `gamificacao_metas`.

---
*Documento gerado para implementação técnica imediata.*
