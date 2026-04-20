# 🧠 NEXUS: MOTOR DE INTELIGÊNCIA E AUTOMAÇÃO (GAMIFICAÇÃO)

Este documento detalha o "Cérebro" do sistema Nexus, responsável pela adaptatividade, automações n8n e integração com IA.

---

## 1. MOTOR ADAPTATIVO (NEXUS AI ENGINE)

O motor analisa o rastro digital do aluno para personalizar a experiência.

### 1.1 Perfis de Comportamento
| Perfil | Critério | Ação do Motor |
| :--- | :--- | :--- |
| **INICIANTE** | < 15 dias de plataforma, nível < 5. | Missões de onboard, tutoriais bônus, feedback acolhedor. |
| **EM EVOLUÇÃO** | Frequência > 3x/semana, taxa de acerto 60-80%. | Missões de trilha padrão, desafios de nível Intermediário. |
| **CONSISTENTE** | Streak > 7 dias, taxa de acerto > 80%. | Desafios Avançados, bônus de multiplicador de XP (1.2x). |
| **AVANÇADO** | Nível > 30, todos os simulados > 90%. | Boss Challenges liberados, missões de mentoria (ajudar outros). |
| **DESENGAJADO** | s/ acesso > 5 dias. | Missões "Resgate" (XP Dobrado por 24h), notificações motivacionais. |

### 1.2 Lógica de Missões Adaptativas (via Gemini)
**Input:** `historico_aluno`, `trilha_atual`, `perfil_comportamento`.
**Prompt:** "Baseado no erro do aluno em 'Permissões Linux', gere um desafio prático de nível Corretivo que foque em chmod."
**Output:** Objeto JSON para a coleção `missoes_atribuidas`.

---

## 2. WORKFLOWS n8n (MÁQUINA DE REGRAS)

Os workflows garantem que a gamificação seja segura e processada no backend.

### W1: Processamento de Pontos & XP
- **Trigger:** Webhook de `exercicio.concluido` ou `simulado.concluido`.
- **Nó Lógica:**
  1. Verifica se é a primeira vez (bônus first-match).
  2. Calcula XP: `Base * Dificuldade * Multiplicador_Streak`.
  3. Atualiza `perfis_usuarios/{userId}` (XP e Nível).
  4. Grava em `historico_xp` para auditoria.

### W2: Gestão de Streak (Diário)
- **Trigger:** Cronjob (00:01h).
- **Nó Lógica:**
  1. Busca todos os usuários.
  2. Verifica `ultimo_acesso`. Se > 24h e < 48h, mantém streak. Se > 48h, reseta.
  3. Se acessou hoje: `streak++`.
  4. Se `streak % 7 == 0`: Libera badge "Consistência de Ferro" e Bônus de Tokens IA.

### W3: Desbloqueio de Conquistas
- **Trigger:** Atualização de perfil do aluno.
- **Nó Lógica:**
  1. Compara `conquistas_aluno` com `biblioteca_badges`.
  2. Se critério atingido: Adiciona badge ao array, dispara notificação `toast` e aumenta XP.

### W4: Resumo Semanal Analítico
- **Trigger:** Domingo, 18h.
- **Nó Lógica:**
  1. Agrega dados de XP e acertos na semana.
  2. Usa Gemini para gerar um comentário: "Você evoluiu 20% em Lógica, mas Cibersegurança precisa de atenção."
  3. Envia para a UI `/notificacoes`.

---

## 3. REGRAS ANTI-ABUSO (EXPLOIT PROTECTION)

1. **Rate Limiting:** Máximo de 5000 XP por dia (exceto Boss Challenges).
2. **Double-Check:** O n8n verifica no Firestore se o exercício já foi pontuado anteriormente.
3. **Temporalidade:** Exercícios concluídos em menos de 10 segundos não geram XP (anti-scripting).

---

## 4. INTEGRAÇÃO COM BI (ANALYTICS)

Todos os eventos de gamificação (Ponto Ganhos, Badge Desbloqueada) enviam uma cópia do payload para o **Google BigQuery / PowerBI** com os campos:
- `timestamp`, `userId`, `studentLevel`, `courseId`, `eventType`, `value`.

Isso permite que o professor veja o **Heatmap de Engajamento** da turma em tempo real.
