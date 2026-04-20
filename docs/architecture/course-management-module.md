# MÓDULO: GESTÃO DE CURSOS (ESTRUTURAS CURRICULARES)

## 1. OBJETIVO DO MÓDULO
O módulo de Gestão de Cursos é a base fundamental pedagógica da plataforma. Diferente das soluções web tradicionais, aqui separamos o conceito de "Curso" da "Turma". O curso atua como uma **Grade Matriz**, comportando as **Unidades Curriculares (UCs)**, e as turmas são "instâncias" deste curso que acomodam os alunos e professores em determinado momento do tempo (semestre/turno).

## 2. ARQUITETURA DE DADOS NO FIREBASE (COLEÇÃO `cursos`)

A coleção `cursos` atuará unicamente com armazenamento dos metadados da estrutura curricular.
As associações pesadas (Quais e quantas turmas dão match com este Curso) são feitas através de chaves estrangeiras (`cursoId`) na coleção `turmas`. As unidades curriculares pertencentes à grade curricular de um curso seguem a mesma regra: um documento em `unidades_curriculares` possui um campo `cursoId`. 
Essa estratégia evita arrays de tamanho infinito (DDoS no limite de 1MB do Firestore) e reduz complexidade de agregação.

### Molde de Documento (JSON Schema)
```json
{
  "id": "CUR-DEV-2026",
  "nome": "Técnico em Desenvolvimento de Sistemas",
  "descricao": "Curso focado em desenvolvimento local e nuvem do eixo tecnológico de Informação.",
  "cargaHoraria": 1200,
  "modalidade": "HIBRIDO", // Enum: PRESENCIAL, EAD, HIBRIDO
  "nivel": "TECNICO", // Enum: CURSO_CURTO, BASICO, TECNICO, QUALIFICACAO, AVANCADO
  "status": "ATIVO", // Enum: ATIVO, INATIVO
  "createdAt": "2026-04-20T10:00:00Z",
  "updatedAt": "2026-04-20T10:00:00Z"
}
```

## 3. AS ESTRUTURAS DAS TELAS (UX ACADÊMICO)

A UI foca no "Administrador" e "Coordenador", utilizando o conceito de Master-Detail:

### 3.1 Tela: Listagem de Cursos (Hub Curricular)
- **Objetivo**: Um terminal analítico localizando rapidamente as grades aprovadas pela instituição.
- **Componentes**: 
  - Barra superior de ferramentas (Create, Export).
  - Tabela formatada: Código, Nome, Carga Horária, Total de Turmas vinculadas (carregadas via contagem em lotes).
- **Ações**: O clique em um dos cursos não abre uma caixa de diálogo, mas conduz para a Interface de Visualização Completa.

### 3.2 Tela: Editor e Visualizador de Curso (Dashboard de Grade)
- **Objetivo**: Fornece o Raio-X do Curso Escolhido.
- **Componentes**:
  - Painel de Dados Cadastrais Básicos (Inputs Editáveis em formato industrial).
  - Tabela em Abas listando: "Turmas do Curso", "Unidades Curriculares da Grade".
  - Botão de Arquivamento/Desativação.

## 4. REGRAS DE NEGÓCIO DA ARQUITETURA
- **Desativação Subsequente**: Ao desativar um Curso, suas Turmas continuam ativas para não interromper fluxos dos alunos. Porém, na exibição do Catálogo de novas turmas, os cursos inativos não podem ser selecionados para criar novas.
- **Exclusão Lógica Rígida**: O Firestore Firebase Security Rules veda a deleção via UI de qualquer curso que já transacionou Vínculos Acadêmicos.
- **Acesso Limitado**: Somente ADM ou usuários com `permissoesGranulares.hasAny(['gerenciar_cursos'])` (RBAC) podem gravar novas matrizes curriculares.

## 5. INTEGRAÇÃO N8N (WORKFLOWS PEDAGÓGICOS)
Como o Catálogo de Cursos do SENAI é governado também pela Administração Regional através do SAP, os workflows n8n estarão configurados como:
- **Catálogo Sync (Nightly Sync)**: Uma trigger N8n de CRON roda à noite enviando um HTTP Request à plataforma legada da Escola, e sincroniza os Cursos com o Firebase puxando via API usando `updateDoc` e `addDoc`.

## 6. ROADMAP DE IMPLEMENTAÇÃO
- **Passo 1 (Codificação UI)**: Criação da UI React unificada `/admin/courses` englobando Tabela de Busca e Painel Lateral Deslizante para Criação Rápida. (Atual);
- **Passo 2 (Mapeamento Relacional)**: A criação dos Hubs de Detalhes abrindo a grade de Unidades Curriculares e vinculando aos relatórios gerenciais das Turmas.
