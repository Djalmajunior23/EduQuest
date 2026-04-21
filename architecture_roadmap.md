# Roadmap de Arquitetura - NexusIntAI Platform

Este documento formaliza as decisões de arquitetura e o planejamento de implementação baseado no Mestre Promp.

## 1. Princípios Fundamentais (Arquitetura SaaS Multi-tenant)
- **Isolamento de Dados (Tenant Isolation):**
  - Todas as coleções críticas no Firestore DEVEM conter o campo `tenantId`.
  - Regras de Segurança (Firestore Rules) devem validar `tenantId` em toda permissão de leitura/escrita.
- **Governança de IA:**
  - Uso de SDK `@google/genai`.
  - Implementação de Fallback (Flash/Pro) e cache de prompts pedagógicos.
  - Controle de custo por `tenantId`.
- **Automação:**
  - n8n atua como middleware para tarefas assíncronas pedagógicas e administrativas.

## 2. Roadmap por Fases
- [ ] **Fase 1:** Core Auth, IAM granular, Firestore Structure, Tenant Isolation.
- [ ] **Fase 2:** Módulos de Gestão Acadêmica (Cursos, UCs, Turmas).
- [ ] **Fase 3:** Motor de Avaliação (Simulados, Exercícios, BI Pedagógico).
- [ ] **Fase 4:** Gamificação (XP, Rankings, Trilhas).
- [ ] **Fase 5:** IA (Professor Toolkit, Tutor IA, Planejador).
- [ ] **Fase 6:** Automações n8n & Notificações.
- [ ] **Fase 7:** Billing (Stripe), SaaS Metering & Scalability.

## 3. Gestão de Segurança
- Regras de Firestore sempre seguem o padrão *Default-Deny*.
- Granularidade de permissões via `permissoesGranulares` no perfil do usuário.
