# MÓDULO: GESTÃO DE UNIDADES CURRICULARES (UCs)

## 1. OBJETIVO DO MÓDULO
O Módulo de Gestão de Unidades Curriculares (UCs) aprofunda a hierarquia pedagógica. Se o "Curso" é o tronco estrutural, as UCs são os galhos. As UCs encapsulam todo o conhecimento técnico e prático de uma disciplina (ex: "Desenvolvimento de APIs REST", "Eletrônica Analógica"), e servem de âncora para a criação de Avaliações, Questões, Situações de Aprendizagem (SA) e Ranqueamento em Trilhas.

## 2. ARQUITETURA DE DADOS NO FIREBASE (COLEÇÃO `unidades_curriculares`)

Cada UC obrigatoriamente vincula-se a um Curso Pai. Essa normalização facilita e otimiza queries (ex: Trazer todas as UCs de Eletrotécnica).

### Molde de Documento (JSON Schema)
```json
{
  "id": "UC-Backend-Node-2026",
  "nome": "Backend Services Integrados com Node.js",
  "descricao": "UC voltada aos princípios Serverless e microsserviços escaláveis.",
  "cargaHoraria": 120,
  "cursoId": "ID_DO_CURSO_PAI",
  "status": "ATIVO", // Enum: ATIVO, INATIVO
  "createdAt": "2026-04-20T10:00:00Z",
  "updatedAt": "2026-04-20T10:00:00Z"
}
```

### Relacionamentos Futuros
Mais adiante na plataforma, coleções estendidas se relacionarão com UCs:
- `conhecimentos_tecnicos`: Subtópicos teóricos da UC.
- `capacidades_tecnicas`: Habilidades práticas extraídas desta UC.

## 3. ESTRUTURAS DE TELA E FLUXO EXPERIÊNCIA (UX)

### 3.1 Lista de Disciplinas (UC Explorer)
- **Objetivo**: Fornecer a bibliotecária visão de todas as disciplinas catalogadas, com filtro por Curso Pai.
- **Visual**: Grid Card View ou Table, focado em agilidade. Seletores superiores Dropdown para filtrar `"Filtrar por Curso Pai"`.

### 3.2 Painel de Injeção de UC (Slide-Over Editor)
- **Objetivo**: Permitir Cadastro Rápido (Quick Add) sem mudar de tela de contexto.
- **Interação**: Seleção mandatória do "Curso" no momento de Criação da UC para garantir integridade referencial.

## 4. REGRAS DE NEGÓCIO DA ARQUITETURA
- **Pertencimento Único**: No SENAI convencional, uma UC pode ser reaproveitada. Nesta arquitetura inicial, para garantir o tracking de performance rigoroso isolado, criamos 1 documento UC por Curso.
- **Segurança (Firestore Rules)**: Escrita protegida. Somente perfis habilitados com cargo `ADMIN` ou com permissão granular `gerenciar_cursos` possuem autoridade de alteração das UCs.
- **Base Pedagógica**: O delete de Unidades Curriculares é desativado via regra se existirem "Questões" (QuestionBank) linkadas ao seu `ucId`.

## 5. ROADMAP
1. **Modelagem Critycal (Atual)**: UI para Cadastro e Relacionamento de UC -> Curso (`UCManager`).
2. **Phase 2 (Metadados)**: Expandir UI para catalogar Capacidades Técnicas (O que o aluno sabe fazer) amarrado àquela UC.
3. **Phase 3 (Docente)**: Vincular professores às UCs que eles são formados/credenciados para lecionar, via tabela ponte `docente_ucs`.
