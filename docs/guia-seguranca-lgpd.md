# Guia de Segurança e LGPD — EduJarvis

## 1. Proteção de Dados (PII)
- **Minimização**: O EduJarvis não armazena CPFs ou endereços residenciais em buffers de IA.
- **Anonimização**: Dados sensíveis são substituídos por tokens randômicos antes de serem enviados para modelos de terceiros (fallback).

## 2. Segurança de IA
- **Bypass Protection**: Filtros bloqueiam tentativas de "Jailbreak" ou "Instruction Injection".
- **Socrático Enforcement**: Bloqueio automático de agentes que tentam fornecer respostas prontas a alunos.

## 3. Auditoria
Todas as mensagens possuem `prompt_hash` e metadados do modelo, permitindo auditoria retroativa em caso de incidentes.
