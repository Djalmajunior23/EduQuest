# ARQUITETURA MESTRE - NEXUSINTAI SAAS EDTECH

Este documento consolida a arquitetura e diretrizes do sistema com base no Master Prompt da plataforma Educacional SaaS multi-tenant.

## 1. STACK TECNOLÓGICO IMPLEMENTADO
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion (animações).
- **Gerenciamento de Estado**: React Context (Auth, Tenant) - *migração gradual para Zustand/React Query onde aplicável*.
- **Backend/Database**: Firebase (Authentication via Google, Firestore Enterprise NoSQL).
- **IA Engine**: Google GenAI SDK (`@google/genai`), fallback logic e custom prompts system.

## 2. FIRESTORE - MODELAGEM DE DADOS (SAAS MULTI-TENANT)

Todos os documentos (exceto `tenants` e `usuarios` root) possuem obrigatoriamente a chave `tenantId`.

### Coleções Principais:
1. `tenants`: Dados da escola/instituição (nome, domínio, plano, limites de IA).
2. `usuarios`: Perfil unificado (nome, email, roles: [ADMIN, PROFESSOR, ALUNO], tenantId).
3. `cursos` e `unidades_curriculares`: Estrutura acadêmica base.
4. `turmas`: Agrupamento de alunos associado a um professor e um curso.

### Coleções de Interação e Gamificação:
5. `simulados` / `exercicios` / `atividades`: Avaliações geradas manual ou via IA.
6. `gamificacao_perfis`: Estado do aluno (nível, XP, streak atual, pontos).
7. `missoes` e `desafios`: Quests ativas para alunos.
8. `badges`: Conquistas desbloqueadas.

### Laboratórios:
9. `laboratorio_categorias`: Divisão (ex: Redes, Programação).
10. `laboratorios`: Descrição, rubricas e checklists gerados por IA.
11. `laboratorio_execucoes`: Evidências submetidas por alunos.

### Sistema (IA e Billing):
12. `ai_usage_logs`: Auditoria de uso de tokens por tenant.
13. `assinaturas` e `faturas`: Integração de Billing (Stripe).

## 3. MOTOR DE INTELIGÊNCIA ARTIFICIAL (IA)
A arquitetura de IA divide-se em dois grandes blocos, centralizados no serviço `aiService.ts`:
- **IA do Professor (Poderosa/Sem limites rígidos)**: Geração de simulados, roteiros de laboratório, análise de sentimentos da turma, sugestões de intervenção baseadas no BI.
- **IA do Aluno (Tutor Controlado)**: Modo socrático. Explica conceitos sem dar respostas prontas. Restrito a uma cota de tokens mensal para evitar abusos no faturamento do SaaS. Usa modelos menores e mais rápidos por padrão para custo-benefício.

## 4. FLUXO DE AUTOMATIZAÇÃO (VISÃO n8n)
O n8n atuará como o "coração assíncrono" do sistema através de Webhooks:
- `Frontend -> Firestore -> [n8n Webhook Listener] -> Lógica de Negócio Sever-side -> [Disparo de Email / Emissão de Certificado / Geração de Fatura] -> Atualização no Firestore.`
- O frontend ouvirá essas mudanças em tempo real através dos `onSnapshot` do Firebase.

## 5. ROADMAP DE EXECUÇÃO ATUAL
- [x] Fase 1: Auth + usuários (Firebase Auth e RBAC)
- [x] Fase 2: Estrutura acadêmica (Gerenciamento de Cursos, UCs, Categorias)
- [ ] Fase 3: Simulados e exercícios
- [ ] Fase 4: IA professor (Integração Gemini)
- [ ] Fase 5: IA aluno
- [ ] Fase 6: Gamificação (Motor de XP finalizado)
- [ ] Fase 7: Laboratórios Práticos
- [ ] Fase 8: BI (Dashboards avançados)
- [ ] Fase 9: Automações (Webhooks n8n)
- [ ] Fase 10: SaaS + Billing (Stripe)
