# Implementação Prática: Workflows n8n - Módulo de Gamificação

Este documento detalha a lógica, payloads e estruturas dos 15 workflows fundamentais para o **Sistema Interativo de Aprendizagem**.

---

## 1. Conceder Pontos por Exercício Concluído
**Objetivo:** Recompensar a prática imediata de questões de fixação.
- **Trigger:** Webhook `aluno.concluiu_exercicio`
- **Payload Esperado:**
  ```json
  {
    "eventId": "evt_ex_123", "alunoId": "user_456", "cursoId": "dev_systems",
    "origemId": "ex_prog_001", "acertos": 8, "total": 10
  }
  ```
- **Nós n8n:** Webhook -> Set (Calcula Pontos: acertos * 10) -> Firestore (Get Perfil) -> Firestore (Update XP/Pontos) -> Firestore (Create Ledger) -> HTML Email/Notification.
- **Firebase:** Atualiza `gamificacao` e `historico_pontos`.

## 2. Conceder Pontos por Simulado Concluído
**Objetivo:** Gamificação de alta performance para avaliações complexas.
- **Trigger:** Webhook `aluno.concluiu_simulado`
- **Lógica:** Bônus de XP baseado no percentual de acerto (ex: > 90% = +500 XP).
- **Firebase:** Atualiza `gamificacao`, `historico_xp` e `progresso_desafio`.

## 3. Atualizar Streak (Ofício Diário)
**Objetivo:** Manter o engajamento através da recorrência.
- **Trigger:** Cron (Diário 00:01) ou Webhook `aluno.primeiro_acesso_dia`.
- **Lógica:** IF (ultimoAcesso == ontem) -> Streak + 1; ELSE -> Reset.
- **Firebase:** Atualiza `streaks`, `gamificacao` e envia `notificacoes_gamificacao`.

## 4. Desbloquear Conquista
**Objetivo:** Celebrar marcos específicos através do catálogo.
- **Trigger:** Node "Switch" após qualquer atribuição de pontos.
- **Lógica:** Verifica se `pontosTotais` >= 1000 ou `missoes_completas` == 50.
- **Firebase:** Adiciona ID em `gamificacao.conquistasIds` e gera registro em `conquistas`.

## 5. Recalcular Ranking Saudável
**Objetivo:** Gerar snapshots de competitividade positiva.
- **Trigger:** Cron (A cada 6 horas).
- **Lógica:** Firestore Query (OrderBy XP Desc, Limit 50) -> Set Position -> Firestore (Create Snapshot em `ranking`).
- **Segurança:** Anonimiza nomes para alunos que optaram por privacidade.

## 6. Conceder Bônus de Tokens
**Objetivo:** Recompensar excelência técnica com recursos de IA.
- **Trigger:** Webhook `aluno.atingiu_meta` (Nível Crítico).
- **Lógica:** Se conquista for 'RARA', concede +5 Tokens IA.
- **Firebase:** Incrementa `saldoTokensIA` em `usuarios` e `gamificacao`.

## 7. Gerar Missão Diária (IA)
**Objetivo:** Oferecer desafios curtos e variados.
- **Trigger:** Cron (Diário 04:00).
- **Nós:** Firestore (Get Alunos Ativos) -> Gemini (Prompt: Geração de Missão) -> Firestore (Create em `missoes`).
- **Idempotência:** Verifica se o aluno já possui 3 missões pendentes.

## 8. Gerar Missão Semanal
**Objetivo:** Desafios de maior complexidade para o fim de semana.
- **Trigger:** Cron (Segundas 06:00).
- **Lógica:** Focada em Projetos ABP ou Situações de Aprendizagem (SA).
- **Firebase:** Insere em `missoes` com `tipo: "SEMANAL"`.

## 9. Gerar Desafio Adaptativo
**Objetivo:** Nivelamento automático baseado em pontos fracos.
- **Trigger:** Webhook `aluno.melhorou_desempenho` ou Motor de Recomendação.
- **IA:** Gemini lê o `dossie_aluno` e sugere desafio X para cobrir gap Y.
- **Firebase:** Atualiza `progresso_desafio`.

## 10. Liberar Boss Challenge
**Objetivo:** Desafio final para conclusão de uma Trilha.
- **Trigger:** IF `progresso_trilha` == 100%.
- **Lógica:** Desbloqueia acesso à coleção `boss_challenges` para o aluno.
- **Notificação:** "O Grande Desafio de {Trilha} está disponível!".

## 11. Atualizar Progresso da Trilha
**Objetivo:** Visualização clara da jornada.
- **Trigger:** Após conclusão de qualquer atividade da trilha.
- **Lógica:** calculo (Atividades Concluídas / Total da Fase).
- **Firebase:** Atualiza `progresso_trilha`.

## 12. Recalcular Metas
**Objetivo:** Ajustar dificuldade das metas inteligentes.
- **Trigger:** Webhook `aluno.usou_ia`.
- **Lógica:** Se o aluno usa IA para resolver fácil, a IA sobe o nível da próxima meta.
- **Firebase:** Atualiza `metas`.

## 13. Enviar Feedback Gamificado
**Objetivo:** Reforço positivo imediato.
- **Trigger:** Qualquer ganho de XP > 100.
- **Nós:** Switch (Valor XP) -> Set (Mensagem: "Incrível!", "Evolução constante!") -> Push Notification.

## 14. Gerar Resumo Semanal do Aluno
**Objetivo:** Visão de progresso e BI pessoal.
- **Trigger:** Cron (Domingos 18:00).
- **Gemini:** Resume eventos do `historico_pontos` em um tom motivador.
- **Firebase:** Envia e-mail e salva em `notificacoes_gamificacao`.

## 15. Gerar Painel Gamificado do Professor
**Objetivo:** Insights preditivos para intervenção pedagógica.
- **Trigger:** Cron (Segundas 07:00).
- **Nós:** Firestore Aggregate (KPIs Turma) -> Gemini (Insights: Quem está desmotivado?) -> Notificação Admin/Professor.

---
### Segurança e Idempotência
1. **Hashing:** Cada evento deve ter um `eventId`. O n8n deve armazenar hashes de `eventId` processados em `logs_gamificacao` para evitar redobro de pontos.
2. **Auth:** Webhooks devem exigir o header `X-EduQuest-Secret` validado pelo nó IF.
3. **Firestore Writes:** Use sempre a operação de "Increment" nativa do Firestore no nó `Function` para evitar condições de corrida (Race Conditions).
