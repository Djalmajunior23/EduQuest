# 🏆 NEXUS: MESTRE OPERACIONAL DE GAMIFICAÇÃO

Este documento contém a implementação técnica completa e pronta para uso do módulo de gamificação.

---

## 1. 🔥 FIREBASE PRONTO (ESTRUTURA & SEGURANÇA)

### Coleções Nucleares
- `gamificacao`: Perfil global de gamificação (XP, Nível, Tokens).
- `ranking`: Índices de performance para Arena Global (Top 100).
- `progresso_trilha`: Estado atual de cada aluno em cada curso.
- `progresso_missao`: Rastreamento de objetivos diários e semanais.
- `conquistas`: Coleção de badges desbloqueadas.
- `missoes_adaptativas`: Sugestões geradas por IA baseadas em gaps técnicos.

### Segurança (ABAC)
- **Leitura:** Alunos leem apenas seus dados; Professores leem turma; Rankings são públicos para leitura filtrada.
- **Escrita:** **100% via n8n (Server-side)**. Alunos não podem editar `XP` ou `XP_TOTAL`. Isso impede trapaças via SDK.
- **Validação:** Documentos de progresso exigem `request.auth.token.email_verified == true`.

---

## 2. ⚡ N8N PRONTO (AUTOMATIZAÇÕES)

### Workflows Principais
1. **CONCEDER_PONTOS:** Gatilho (Firebase OnWrite Quiz) -> Cálculo (Formula Pedagógica) -> Update (Firebase XP).
2. **RANKING_SYNC:** Gatilho (Cron 15min) -> Map (Top Students) -> Sync (Collection `ranking`).
3. **STREAK_ORCHESTRATOR:** Gatilho (Daily Check) -> Logic (Last Activity Date) -> Reset/Increment Streak.
4. **AI_MISSION_GENERATOR:** Gatilho (Gap Detection BI) -> IA Prompt (Gemini) -> Push Task to `missoes_adaptativas`.

---

## 3. 🖥️ TELAS PRONTAS (IMPLEMENTAÇÃO UI/UX)

- **Aluno (`StudentGamification.tsx`):** Dashboard imersivo com trilhas, mural de missões, arena de desafios, hall de conquistas e metas inteligentes.
- **Professor (`ProfessorGamification.tsx`):** Gestão de engajamento da turma, dashboard de insights da IA e ações rápidas (lançar missão relâmpago).
- **Admin (`AdminGamification.tsx`):** Central de infraestrutura, monitoramento de hooks n8n e integração BI.

---

## 4. 🧠 REGRAS DE NEGÓCIO (LOGICA DE MOTOR)

### Fórmulas de XP
- **Linear:** `Nível = floor(XP / 1000) + 1`
- **Exponencial (Opcional):** `XP_Prox_Nivel = 1000 * (Level ^ 1.5)`

### Multiplicadores Táticos
- **Streak 7+ dias:** +15% XP em todas as atividades.
- **Horário de Elite (20h-23h):** +10% XP para incentivo noturno.
- **Mentor Mode:** Ganhe 500 XP ao validar uma resposta correta no fórum.

---

## 5. 📊 INTEGRAÇÕES (IA, BI & MOTOR)

- **IA (Gemini):** Gera missões adaptativas analisando erros no `QuestionBank` e sugerindo reforço técnico.
- **BI (PowerBI/Superset):** Exportação via Webhook n8n para análise de retenção e eficácia pedagógica.
- **Motor Inteligente:** Orquestra a dificuldade dos desafios baseando-se no `skillLevel` do usuário no Firestore.

---

## 🚀 COMO ATIVAR AGORA

1. **Firebase:** Rode o comando de deploy de regras (`npm run deploy:rules`).
2. **n8n:** Importe o template JSON da pasta `n8n_templates`.
3. **Frontend:** Acesse as rotas `/gamification`, `/gamification-professor` ou `/admin/gamification`.
