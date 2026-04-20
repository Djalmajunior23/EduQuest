# ARQUITETURA MESTRA — PLATAFORMA EDUCACIONAL INTELIGENTE (SENAI)

## 1. VISÃO DO PROJETO
Esta plataforma é um ecossistema **SaaS Educacional Orientado a Eventos**. O core transacional reside no **Firebase**, enquanto a inteligência lógica e pedagógica é orquestrada por **Workflows no n8n**. O objetivo é personalizar a aprendizagem de forma adaptativa, utilizando IA para reduzir a carga do professor e aumentar o engajamento do aluno.

## 2. CAMADAS LÓGICAS E FÍSICAS

### Camada 1: Apresentação (React + Tailwind)
- Hospedagem: HostGator.
- Single Page Application (SPA) construída com Vite.
- Comunicação direta com Firebase SDK.
- Gatilhos de eventos via Webhooks para o n8n.

### Camada 2: Backend-as-a-Service (Firebase)
- **Auth**: Gestão de identidades (Login Google).
- **Firestore**: Banco de dados NoSQL para estados, perfis e indicadores.
- **Storage**: Repositório de arquivos, PDFs e materiais de apoio.
- **Security Rules**: Proteção granular baseada em RBAC (Role-Based Access Control).

### Camada 3: Automação e Orquestração (n8n na Hostinger)
- O "Cérebro Escondido".
- Processa resultados de provas em tempo real.
- Aciona a API Gemini para análise de sentimentos e classificação cognitiva.
- Repopula o Firestore com planos de estudo dinâmicos.

## 3. MAPA DE COLEÇÕES DO FIRESTORE (ESTADO ATUAL E FUTURO)

- `usuarios`: Documentos de perfil, permissões e vinculos.
- `cursos`: Árvore de cursos técnicos.
- `unidades_curriculares`: Disciplinas vinculadas a cursos.
- `capacidades_tecnicas`: Verbos de ação pedagógicos.
- `conhecimentos_tecnicos`: Base teórica.
- `turmas`: Instâncias de turmas letivas.
- `vinculos_academicos`: M2M entre Aluno/Professor e Turmas.
- `questoes`: Banco Geral de Questões.
- `simulados` / `resultados`: Dados de performance.
- `perfil_aluno`: Snapshot cognitivo gerado pela IA.
- `planos_estudo`: Recomendações personalizadas.
- `gamificacao`: XP, Coins e Conquistas.
- `uso_ia`: Logs de tokens e interações.

## 4. MOTOR INTELIGENTE (ADAPTIVE LEARNING)
- **Inputs**: Frequência, acertos, tempo de tela, interações IA.
- **Processamento**: n8n workflows categorizam o aluno em perfis (Iniciante, Consistente, Avançado, Em Risco).
- **Outputs**: Alertas para professores, ajuste de dificuldade na trilha do aluno.

## 5. GOVERNANÇA E SEGURANÇA
- **RBAC**: ADMIN (Gestão total), PROFESSOR (Gestão pedagógica), ALUNO (Consumo e performance).
- **Logs**: Todas as decisões do "Motor" são salvas em `historico_decisoes` para auditoria do professor.
- **Proteção PII**: Dados sensíveis isolados e regras de segurança que impedem que um aluno leia o perfil de outro.
