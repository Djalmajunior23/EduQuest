# Guia de Importação de Workflows n8n - EduQuest

Este documento contém os JSONs para importação direta no n8n. Siga as instruções para cada workflow.

## 1. Webhook Principal de Eventos (Orquestrador)
Este workflow recebe eventos do Firebase (via Cloud Functions ou Trigger) e despacha para os módulos específicos.

```json
{
  "name": "EduQuest - Webhook Principal",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "eduquest-events",
        "options": {}
      },
      "name": "Webhook Principal",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [100, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$node[\"Webhook Principal\"].json[\"body\"][\"type\"]}}",
              "value2": "MISSION_COMPLETE"
            }
          ]
        }
      },
      "name": "Filtro: Missão Concluída",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [350, 300]
    },
    {
      "parameters": {
        "url": "https://seu-n8n.com/webhook/grant-points",
        "method": "POST",
        "bodyParametersUi": {
          "parameter": [
            {
              "name": "userId",
              "value": "={{$node[\"Webhook Principal\"].json[\"body\"][\"userId\"]}}"
            },
            {
              "name": "xp",
              "value": "={{$node[\"Webhook Principal\"].json[\"body\"][\"xpReward\"]}}"
            }
          ]
        }
      },
      "name": "Chamar: Concessão de Pontos",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [600, 200]
    }
  ],
  "connections": {
    "Webhook Principal": {
      "main": [[{"node": "Filtro: Missão Concluída", "type": "main", "index": 0}]]
    },
    "Filtro: Missão Concluída": {
      "main": [[{"node": "Chamar: Concessão de Pontos", "type": "main", "index": 0}]]
    }
  }
}
```

## 2. Fluxo de Atualização de Streak (Diário)
Sincroniza os dias seguidos de atividade do aluno.

```json
{
  "name": "EduQuest - Atualização de Streak",
  "nodes": [
    {
      "parameters": {
        "triggerTimes": {
          "item": [{"hour": 0}]
        }
      },
      "name": "Cron Diário (Meia-noite)",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [100, 500]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT id FROM usuarios WHERE ultimoAcesso < NOW() - INTERVAL '24 HOURS'"
      },
      "name": "FireStore: Buscar Inativos",
      "type": "n8n-nodes-base.googleFirestore",
      "typeVersion": 1,
      "position": [350, 500]
    }
  ],
  "connections": {}
}
```

## 3. Motor Adaptativo (IA Mission Generator)
Gera missões personalizadas usando a API do Gemini.

```json
{
  "name": "EduQuest - Motor Adaptativo",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "generate-adaptive-missions"
      },
      "name": "Trigger: Pedido de Missão",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [100, 700]
    },
    {
      "parameters": {
        "model": "gemini-1.5-pro",
        "prompt": "=Crie uma missão técnica de gamificação para um aluno no curso {{$json[\"course\"]}}. Nível atual: {{$json[\"level\"]}}. Pontos fracos: {{$json[\"weakness\"]}}.",
        "options": {}
      },
      "name": "Google Gemini (IA)",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [400, 700]
    }
  ],
  "connections": {}
}
```

---
**Instruções:**
1. Copie o JSON desejado.
2. No n8n, vá em `Workflows` > `Import from JSON`.
3. Configure as credenciais do Google Cloud (Firestore) e Gemini API nas configurações de cada nó.
