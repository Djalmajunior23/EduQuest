## Fluxo n8n: Gamification Engine (Calculate XP)

### Objetivo
Processar conclusões de atividades e recompensar alunos.

### 1. Gatilho (Webhook)
- **POST** `/webhook/gamification/activity-complete`
- **Payload esperada:**
  ```json
  {
    "userId": "user_123",
    "tenantId": "escolaxyz_123",
    "cursoId": "dev_sistemas",
    "activityType": "exercise",
    "difficulty": "medium"
  }
  ```

### 2. Fluxo de nós no n8n
1.  **Webhook Node**: Recebe os dados.
2.  **Firestore Node (Get)**: Busca o documento `gamification_state` do usuário atual.
3.  **Code Node (Set Logic)**: 
    *   Calcula o XP ganho (ex: `difficulty === 'medium' ? 50 : 20`).
    *   Verifica se ultrapassou o XP necessário para o `level` atual.
    *   Calcula novo nível e incrementa `xp`.
4.  **Firestore Node (Update)**: Atualiza `gamification_state`.
5.  **Condition Node**: Verifica se o novo XP desbloqueou uma nova `Badge` baseada nos critérios.
6.  **Firestore Node (Add)**: Se desbloqueou, adiciona Badge à coleção `user_badges`.
7.  **Webhook (Return)**: Retorna sucesso para o Frontend (para exibir animação).
