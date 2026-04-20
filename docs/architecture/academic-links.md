# MÓDULO DE GESTÃO DE TURMAS, CURSOS E VÍNCULOS ACADÊMICOS

## 1. ARQUITETURA DO MÓDULO
O módulo é altamente escalável não relacional, desenvolvido puramente em **NoSQL (Firestore)**. A premissa central é nunca inflar documentos excessivamente. Em vez de arrays gigantes com 200 IDs de "alunos_matriculados" ou "professores" dentro das coleções de "Turmas", utilizamos o modelo de **"Nó de Ligação" (AcademicLink)**. É ele quem liga qualquer usuário (Aluno, Professor ou Coordenador) aos agrupamentos Pedagógicos.

## 2. TELAS DO MÓDULO (`/admin/academic`)
### 2.1 Hub Acadêmico (Listagem e Estrutura)
- **Objetivo**: Fornecer a visão executiva onde Coordenadores abrem Cursos -> Turmas -> Grade (Unidades Curriculares).
- **Componentes**: 
  - Tabela Interativa Expandível (Accordion Row para o drill-down de Curso até Turma); 
  - Painel de Filtros Ágeis (Por Eixo Tecnológico ou Turno).
- **Regras de Acesso**: Apenas `ADMIN` e `COORDINATOR` com herança explícita para gestão.

### 2.2 Dashboard Gestão de Turma (Detalhe e Vinculação)
- **Objetivo**: Central de controle da "sala de aula" isolada.
- **Componentes**: 
  - Botão de "Alocar Lote Vazio" (Importação via CSV de matrículas);
  - Duas Abas: Corpo Discente (Alunos), Corpo Docente (Professores)
- **Ações**: Ao tentar excluir, o vínculo não é de fato excluído, e sim "inativado" mantendo histórico de passagem daquele aluno pela turma.

## 3. COLEÇÕES DO FIREBASE OTIMIZADAS
| Coleção | Interface do Blueprint | Responsabilidade | Leitura / Escrita (Rules) |
|---|---|---|---|
| `cursos` | **Course** | Grade Central (Técnico, Aperfeiçoamento...) | Read: `isSignedIn()` Write: `ADMIN \| COORD` |
| `turmas` | **ClassGroup** | Grupo Físico de Aula (Ex: TDS-Noite-01) | Read: `isSignedIn()` Write: `ADMIN \| COORD` |
| `unidades_curriculares` | **CurricularUnit** | As matérias do SENAI | Read: `isSignedIn()` Write: `ADMIN \| COORD` |
| `vinculos` | **AcademicLink** | Liga `[User]` a `[Turma]` no papel `Aluno/Prof` | Read: `isSignedIn()` Write: `ADMIN \| COORD` |

### Exemplo do Documento em `vinculos_academicos`
```json
{
  "userId": "Z2fM0...Ujs49",
  "targetType": "TURMA",
  "targetId": "H4L...L9O",
  "roleInContext": "ALUNO",
  "status": "ATIVO",
  "createdAt": "2026-04-20T08:00:00Z"
}
```

## 4. REGRAS DE NEGÓCIO DA ARQUITETURA
1. **Atribuição Flexível**: Um mesmo usuário Firebase pode possuir dois vínculos: Ele é "Aluno" na Turma Front-End e "Professor Monitor" na Turma HTML-Básico, tudo controlado pela field relacional `roleInContext`.
2. **Consultoria Inversa (Indexação)**: Em todos os outros módulos (Gamificação, SA's do professor, Ranking de BI), quando pedirmos *"Me dê os alunos desta turma"*, bateremos na coleção `vinculos` (buscando `targetId == X && role == ALUNO`) em vez de varrer o banco de alunos inteiro, que garante O(1) de custo e não O(N) nas queries do app.
3. **Imutabilidade Histórica**: Se um professor sai da instituição e troca o status no `AcademicLink` para `INATIVO`, todas as correções que ele efetuou nos Simulados da turma antigamente **não são perdidas**.

## 5. EXPERIÊNCIA (UX/UI) E ROADMAP
- O roadmap inicial exigirá alterar o Modal de Convite (que criei anteriormente) para já disparar o Vínculo Acadêmico (além da criação da conta) de uma só vez, diminuindo a jornada do Coordenador.
- **Fase 1:** Construção dos Cadastros Base das 3 novas entidades do banco.
- **Fase 2:** Ferramenta "Drag'n'Drop" de professores na tela de Detalhes da Turma.
- **Fase 3:** Religar o Quadro Kanban e Gamificação para beber puramente dos vínculos da nova arquitetura.
