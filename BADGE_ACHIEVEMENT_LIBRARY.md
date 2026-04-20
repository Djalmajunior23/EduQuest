# 🎖️ NEXUS: BIBLIOTECA COMPLETA DE BADGES E CONQUISTAS

Este documento define a biblioteca mestre de recompensas visuais e técnicas da plataforma, organizada para maximizar o engajamento de adolescentes e jovens através de reconhecimento por competência.

---

## 1. 💎 SISTEMA DE RARIDADES

As raridades definem o prestígio e o valor matemático da conquista/badge.

| Raridade | Quando usar? | Multiplicador de XP | Impacto Visual |
| :--- | :--- | :--- | :--- |
| **COMUM** | Ações básicas, início de trilhas, primeiros acessos. | 1.0x | Bronze / Minimalista |
| **INCOMUM** | Conclusão de submódulos, consistência inicial (3 dias). | 1.5x | Prata / Efeitos Simples |
| **RARA** | Desafios de lógica hard, domínio de conhecimentos técnicos. | 2.5x | Ouro / Glow Animado |
| **ÉPICA** | Conclusão de trilhas completas, streaks longos (15+ dias). | 5.0x | Safira / Efeitos de Partícula |
| **LENDÁRIA** | Boss Challenges vencidos, primeiro lugar no ranking anual. | 10.0x | Diamante / Holográfico |

---

## 2. 🏛️ CATEGORIAS DE MESTRE

1. **Início de Jornada:** Quebra de inércia e integração.
2. **Progresso Técnico:** Evolução em subtemas específicos.
3. **Consistência:** Foco na repetição e hábito de estudo.
4. **Superação:** Recuperação de notas ou melhoria após erros contínuos.
5. **Trilhas:** Marcos de conclusão de mapas de aprendizado.
6. **Desafios:** Vitórias em arenas práticas e simuladores.
7. **Boss Challenge:** Superação de desafios finais épicos.
8. **IA Produtiva:** Uso inteligente do tutor IA para resolver problemas.
9. **Colaboração:** Ajuda a pares e liderança em projetos ABP.

---

## 3. 🎯 BIBLIOTECA POR CURSO

### 3.1 Desenvolvimento de Sistemas
- **Algoritmo de Ferro (Comum):** Primeiro algoritmo correto.
- **Caçador de Bugs (Incomum):** 10 correções sintáticas validadas.
- **Dominador do CRUD (Rara):** Integração perfeita entre Frontend e DB.
- **Arquiteto de Algoritmos (Épica):** Lógica complexa com O(log n).

### 3.2 Informática para Internet
- **Guardião do CSS (Rara):** Layout responsivo perfeito sem frameworks.
- **Frontend Ninja (Épica):** Integração fluida de múltiplas APIs.
- **UX Explorer (Incomum):** Pesquisa de usuário e protótipo aprovado.
- **Mestre do HTML (Comum):** Estrutura semântica nota 10.

### 3.3 Cibersegurança
- **Analista SOC (Rara):** Detecção de padrões de intrusão em logs reais.
- **Sentinela Digital (Épica):** Firewall configurado com Zero Trust.
- **Pentester Iniciante (Incomum):** Primeira vulnerabilidade corrigida.
- **Guardião da Segurança (Lendária):** Proteção integral de um Boss Server.

### 3.4 Linux e Cibersegurança
- **Terminal Master (Rara):** 100% de lab concluído via CLI.
- **Mestre do Hardening (Lendária):** Kernel Linux imune a CVEs catalogadas.
- **Guardião do Shell (Incomum):** Scripts de automação Bash funcionais.
- **Operador de Sistemas (Comum):** Gestão perfeita de permissões e grupos.

---

## 4. 🌍 CONQUISTAS UNIVERSAIS

- **7 Dias de Fogo:** Streak semanal ininterrupto.
- **Fênix Digital:** Conclusão de recuperação com nota máxima.
- **Mestre da Automação:** Meta inteligente criada e alcançada via IA.
- **Explorador Nexus:** Visitou e utilizou todos os módulos da plataforma.
- **Evolução Contínua:** 30 dias de login ativo com gasto de XP.

---

## 5. 🛠️ INTEGRAÇÃO FIREBASE

### Coleção: `badges`
```json
{
  "id": "linux-master",
  "nome": "Terminal Master",
  "raridade": "RARA",
  "xp": 1200,
  "tokensIA": 20,
  "cursoId": "linux-basic",
  "regra": "CLI_ONLY_TASKS >= 50"
}
```

### Coleção: `conquistas` (Desbloqueadas)
```json
{
  "alunoId": "user_123",
  "badgeId": "linux-master",
  "conquistadoEm": "timestamp",
  "bonusProcessado": true
}
```

### Lógica de Motor (n8n)
O n8n monitora `eventos_gamificacao`. Ao processar um evento `LAB_COMPLETED` com `cli_usage: true`, ele incrementa o contador do aluno. Ao atingir o limite, o n8n cria o documento na coleção `conquistas` e dispara uma notificação `ACHIEVEMENT` via FCM/Firestore.
