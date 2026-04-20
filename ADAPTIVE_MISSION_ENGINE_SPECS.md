# Especificações do Motor Adaptativo de Missões — EduQuest SENAI

Este documento detalha o funcionamento do **Motor Inteligente de Gamificação**, responsável por personalizar a jornada do aluno com base em dados reais de desempenho e comportamento.

## 1. Arquitetura do Motor

O motor opera em um ciclo de malha fechada (Closed-Loop) integrando três camadas:

1.  **🏦 Camada de Dados (Firebase):** Onde residem os perfis, logs de erros e trilhas técnicos.
2.  **🧠 Camada de Inteligência (n8n + Gemini):** Onde os dados são processados para gerar a "Próxima Melhor Missão".
3.  **🎮 Camada de Entrega (Frontend):** Onde o aluno interage com a missão no Dashboard.

### Fluxo de Decisão
1.  **Trigger:** Evento do aluno (login, erro em simulado, conclusão de fase) aciona Webhook do n8n.
2.  **Ingestão:** n8n coleta `resultados`, `perfil_aluno` e `progresso_missao`.
3.  **Classificação:** O motor identifica o `Perfil do Aluno` (ex: Em Recuperação).
4.  **Prompting:** Gemini recebe o contexto técnico e o perfil para gerar a missão adaptada.
5.  **Deploy:** A missão é escrita no Firestore na coleção `missoes_adaptativas`.

---

## 2. Perfis de Aluno e Regras de Adaptação

| Perfil | Características | Estratégia de Missão | Dificuldade |
| :--- | :--- | :--- | :--- |
| **Iniciante Inseguro** | Baixa frequência, muitos erros em fundamentos. | Missões de revisão de conceitos base, linguagem encorajadora. | 🟢 Fácil |
| **Em Evolução** | Erros pontuais, frequência estável. | Missões que conectam o erro recente a um novo conceito técnico. | 🟡 Média |
| **Consistente** | Alto streak, desempenho estável. | Missões de automação e desafios práticos de média duração. | 🟡 Média |
| **Avançado** | Erro < 10%, termina trilhas rápido. | "Hardening" de conhecimentos, Boss Challenges e missões de "Peer Review". | 🔴 Hard |
| **Desengajado** | Não loga há 48h+, streak quebrado. | Missão de "Quick Win" (curta, fácil) com recompensa de tokens. | 🟢 Fácil |
| **Em Recuperação** | Vindo de uma sequência de falhas. | Missões de reforço de capacidades técnicas específicas com dicas extras. | 🟢 Fácil |
| **Alto Potencial** | Acerta questões difíceis, usa muita IA. | Desafios de lógica complexa, arquitetura e Cibersegurança avançada. | 🔴 Hard |

---

## 3. Missões Adaptativas por Curso (Exemplos)

### 💻 Dev Academy (Sistemas)
- **Adaptativa (Recuperação):** "Detectamos dificuldades em Loops. Complete esta estrutura `for` para iterar em uma lista de alunos."
- **Adaptativa (Avançado):** "Refatore este algoritmo de ordenação para reduzir a complexidade de tempo."

### 🌐 Web Builder (Informática para Internet)
- **Adaptativa (Revisão):** "Seu CSS de Flexbox quebrou no último simulado. Ajuste o `justify-content` neste container virtual."

### 🛡️ Cyber Defender (Cibersegurança)
- **Adaptativa (Especial):** "Um log de servidor indica um possível Ataque DDOS. Identifique o padrão de IPs anômalos."

---

## 4. Workflows n8n (Motor de Automação)

### Workflow A: Gerador de Missão Diária (CRON)
- **Frequência:** 00:00 AM.
- **Lógica:** Varre `usuarios` -> Filtra ativos -> Consulta IA para gerar 3 opções -> Salva em `missoes`.

### Workflow B: Reativação Inteligente
- **Frequência:** Trigger de "Inatividade 48h".
- **Lógica:** Envia e-mail/push: "Ei, Operador! O sistema de Cyber-Defesa precisa de você. Conclua essa missão rápida e ganhe 2x XP hoje."

---

## 5. Integração com Firebase (Coleções)

- `usuarios`: Documentos com `xp`, `streak`, `saldoTokensIA`, `currentProfile`.
- `logs_erros_tecnicos`: Sub-coleção com IDs de competências que o aluno falhou nos simulados.
- `missoes_adaptativas`: Documentos com `userId`, `promptIA`, `threshold`, `status`.
- `conquistas_pedagogicas`: Badges vinculadas a superação de dificuldades (ex: "Mestre do Debug").

---

## 6. Lógica Adaptativa Pedagógica (Regras de Ouro)

1.  **Prioridade Corretiva:** Se o aluno errou > 3 questões de SQL, a próxima missão DEVE ser de SQL.
2.  **Limite de Carga:** Máximo de 3 missões adaptativas simultâneas para evitar frustração.
3.  **Feedback IA:** O feedback ao concluir uma missão deve ser gerado pela IA focando na competência técnica superada.
