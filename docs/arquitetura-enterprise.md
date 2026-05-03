# Arquitetura Enterprise EduJarvis 3.0

## 1. Visão Geral
O EduJarvis é o núcleo de inteligência do NexusInt AI, operando em uma arquitetura de microsserviços orientada a eventos e multi-tenant.

## 2. Pilares de Produção
- **Isolamento de Dados**: Utilização de Row Level Security (RLS) e filtragem por `tenantId` em todas as camadas.
- **Observabilidade**: Logs de latência, consumo de tokens e custo por transação via `ObservabilityService`.
- **Governança de IA**: Versionamento de prompts e modelos para garantir repetibilidade e auditoria.

## 3. Fluxo de Transação IA
1. **Interception**: O `EduJarvisService` valida créditos e permissões.
2. **Safety Guard**: Análise neural contra prompt injection e conteúdo inadequado.
3. **Orchestration**: O `Orchestrator` classifica a intenção e seleciona o agente.
4. **Execution**: O Agente (ex: `TutorAgent`) gera a resposta usando o modelo roteado.
5. **Evaluation**: O `AIEvaluationService` valida a qualidade pedagógica antes da entrega.
6. **Audit**: Persistência imutável da transação para fins de compliance.

---
*Gerado automaticamente para EduJarvis Phase 10.*
