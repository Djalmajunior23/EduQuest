# PAINEL DO MOTOR INTELIGENTE (ADAPTATIVE LEARNING ENGINE)

## 1. O CÉREBRO DA PLATAFORMA
O **Motor Inteligente** atua como um supervisor 24/7. Diferente de plataformas conteudistas passivas (onde o aluno "caça" o que estudar), essa arquitetura opera sob o paradigma de **Aprendizagem Adaptativa Ativa**: o sistema ingere a "telemetria" do estudante (cliques, respostas, interações com IA, notas nas DPs/Capacidades) e envia esses sinais para a nuvem.

No backend da nuvem (via **n8n / Cloud Functions / Gemini**), algoritmos tomam decisões para ajustar a jornada.

## 2. ARQUITETURA DE DADOS (FIREBASE - COLLECTIONS)

O Motor consome e cospe resultados nestas coleções especializadas:

### 2.1 `perfil_aluno` (A "Fotografia" Cognitiva)
Calculado recursivamente a cada semana de estudos.
```json
{
  "alunoId": "UID_AQUI",
  "classificacaoAtual": "INICIANTE_INSEGURO", 
  "taxaAcertoGeral": 45.5,
  "pontosFortes": ["CAP-DEV-001", "CAP-REDES-002"],
  "pontosFracos": ["CAP-ALGO-010"],
  "riscoEvasao": "ALTO",
  "updatedAt": "2026-04-20T10:00:00Z"
}
```

### 2.2 `planos_estudo` (A Trilha Muta)
Criado ou Modificado pelo n8n se o aluno vai mal.
```json
{
  "studentId": "UID",
  "semana": 4,
  "focoPrincipalId": "CAP-ALGO-010",
  "tarefasRecomendadas": [
     { "tipo": "REVISAO", "refId": "MATERIAL-44" },
     { "tipo": "EXERCICIO", "refId": "X-304" }
  ],
  "status": "ATIVO"
}
```

### 2.3 `alertas_pedagogicos` (O Grito do Sistema)
Encaminhados para o Painel de Insights do Professor ou do Coordenador.
```json
{
  "targetProfessorId": "PROF_UID",
  "alunoId": "ALUNO_UID",
  "severidade": "VERMELHA",
  "motivo": "Queda abrupta de retenção e acertos em Eletrônica Digital.",
  "sugestaoAcao": "Chamar para mentoria 1:1 focada em Lei de Ohm."
}
```

## 3. WORKFLOWS NO N8N (OS NEURÔNIOS)

A lógica real do motor fica fora do React, hospedada no **n8n**.

- **Workflow 1 (Cron Job Semanal de Análise)**: 
  - *Trigger*: Todo domingo 00:00.
  - *Extract*: Pega tabela `questoes_resolvidas` e `uso_ia`.
  - *Transform (Gemini Node)*: Pede para a Inteligência Artifical ranquear os alunos. 
  - *Load*: Atualiza coleção `perfil_aluno`.
- **Workflow 4 (Alerta de Risco em Tempo Real)**:
  - *Trigger*: Aluno erra 3 exercícios seguidos de nível Básico.
  - *Action*: Injeta documento em `alertas_pedagogicos` pro professor e reduz Dificuldade Global do aluno para o resto do dia.
- **Workflow 6 (Reward Engine)**:
  - *Trigger*: Aluno passa de 'INICIANTE_INSEGURO' para 'CONSISTENTE'.
  - *Action*: Injeta em `gamificacao` +500 XP e +50 Tokens IA.

## 4. REGRA DE NEGÓCIO E ETICA (LIMITADORES DA IA)
- **Professor in the Loop (Autonomia Superior)**: Apesar da IA recomendar bloqueios e traçar perfis cognitivos, o humano (Professor) **sempre** tem no seu Dashboard um botão "Override/Ignorar Sugestão".
- **Sistema Positivo**: Os feedbacks da IA para o aluno nunca usam o termo "Risco de Reprovação", substituem por "Oportunidade Cativante de Melhorar". O "Risco" é flaggado apenas no Painel do Professor.

## 5. IMPACTO PRODUTIVO
Pela primeira vez a plataforma deixa de ser apenas um "Repositório de Links". Se uma turma de Manutenção Mecânica possui 30 alunos, na quinta aula haverão 30 trilhas ligeiramente diferentes sendo construídas pelo banco em tempo real de acordo com as fraturas de conhecimento individuais de cada um.
