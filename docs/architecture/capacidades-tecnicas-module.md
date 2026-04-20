# MÓDULO: GESTÃO DE CAPACIDADES TÉCNICAS

## 1. OBJETIVO GERAL E PEDAGÓGICO
Capacidades Técnicas são os "Verbos de Ação" do ecossistema educacional. Se a UC (Unidade Curricular) é o território de estudo, e os Conhecimentos Técnicos representam a teoria mapeada, as **Capacidades Técnicas** documentam o que o estudante efetivamente *consegue fazer* com aquilo na prática (Ex: "Desenvolver uma arquitetura REST", "Confeccionar uma peça no Torno CNC").
Elas são vitais porque o Motor de Avaliação IA e as Trilhas de BI do n8n analisam o ranqueamento do aprendiz primariamente com base no domínio destas Capacidades Técnicas.

## 2. ARQUITETURA NO FIREBASE (COLEÇÃO `capacidades_tecnicas`)

Cada Capacidade Técnica está fortemente acoplada a uma Unidade Curricular.

### Representação JSON
```json
{
  "id": "CAP-DEV-001",
  "nome": "Estruturar Bancos de Dados Relacionais",
  "descricao": "Capacidade de desenhar e modelar esquemas normalizados SQL.",
  "unidadeCurricularId": "ID_DA_UC_AQUI",
  "nivel": "INTERMEDIARIO", // Enum: BASICO, INTERMEDIARIO, AVANCADO, ESPECIALISTA
  "status": "ATIVO",
  "createdAt": "2026-04-20T10:00:00Z",
  "updatedAt": "2026-04-20T10:00:00Z"
}
```

## 3. RELACIONAMENTOS ESTENDIDOS (CROSS-CUTTING)
- **Questões / Simulados**: Ao cadastrar uma questão no Bank de provas, o docente agora pode marcar "Esta questão testa a Capacidade Técnica CAP-DEV-001".
- **Situações de Aprendizagem (SA)**: Cada passo de uma SA treina uma sub-lista específica de Capacidades Técnicas.
- **Conhecimentos_Técnicos (Futuro)**: Uma tabela M:N virtual poderá inferir que para atingir a referida Capacidade Prática, o usuário deve dominar "Conhecimentos N, X, Z".

## 4. TELAS E UX GESTÃO ADMINISTRATIVA
A ferramenta destina-se a bibliotecários e coordenadores educacionais montando o *Corpus* letivo. Segue o padrão estabelecido da UI:
1. **Explore Table**: Tabela de busca permitindo filtrar primariamente por "UC Pai".
2. **Side-Panel Action**: Slider lateral injetado para CRUD, evitando transições pesadas de renderização global e permitindo consultas visuais na lista à esquerda enquanto escreve no formulário à direita.

## 5. REGRAS DE ACESSO (RBAC) E GERAÇÃO DE LOGS
- Apenas usuários com Perfil de **ADMIN**, **COORDINATOR** ou com permissões explícitas `hasPermission('gerenciar_pedagogico')` podem Criar, Atualizar ou Deletar (CUD) as Capacidades. 
- Professores apenas "Leem" (Read-Only) esta tabela durante a montagem das aulas deles.

## 6. IMPACTO IA & BI
- A IA do Tutor usará queries de aproximação lexical entre a "Pergunta do Aluno no chat" e o "Banco de Capacidades Técnicas" do curso dele, rastreando automaticamente quais competências práticas aquele estudante está com dificuldade.
