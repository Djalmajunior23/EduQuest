# EduQuest - Template de Importação de Alunos

Utilize este formato para realizar a importação em lote de alunos para o Sistema Interativo de Aprendizagem.

| nome | email | cursoId | turmaId | perfil | status | senha_provisoria |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| João Silva | joao.silva@estudante.com | dev_systems | turma_2024_a | ALUNO | ATIVO | Senai@123 |
| Maria Oliveira | maria.o@estudante.com | cyber_sec | turma_2024_b | ALUNO | ATIVO | Senai@123 |
| Carlos Souza | carlos.s@estudante.com | info_internet | turma_2024_a | ALUNO | ATIVO | Senai@123 |

### Instruções de Preenchimento:
1. **nome:** Nome completo do estudante.
2. **email:** E-mail institucional ou pessoal (chave única).
3. **cursoId:** Identificador do curso (ex: `dev_systems`, `cyber_sec`, `info_internet`).
4. **turmaId:** Identificador da turma cadastrada.
5. **perfil:** Deve ser exatamente `ALUNO`.
6. **status:** Deve ser `ATIVO`.
7. **senha_provisoria:** Senha inicial que o aluno usará no primeiro acesso.

---

## Workflow n8n: Importação em Lote
**Nome:** EduQuest - Importação de Alunos (CSV/Planilha)

1. **Trigger:** Webhook (POST) ou Google Drive (Watch File).
2. **Nós:**
   - **Spreadsheet File:** Lê o arquivo recebido.
   - **Item Lists:** Divide a planilha em linhas individuais.
   - **Firestore (Check User):** Verifica se o e-mail já existe.
   - **IF (User Exists):**
     - **TRUE:** Log de "Ignorado (Duplicado)".
     - **FALSE:** Firestore (Create User) + Firestore (Create Gamification Profile) + Auth Service (Create Firebase Auth User).
   - **Wait:** Pequeno delay (200ms) entre criações para evitar limites de taxa.
   - **Summary:** Envia relatório via e-mail para o administrador com (Sucessos: X, Erros: Y).

**Payload de Resposta (Status):**
```json
{
  "totalProcessado": 50,
  "sucesso": 48,
  "falhas": 2,
  "erros": [
    {"email": "erro@email.com", "motivo": "cursoId inválido"}
  ]
}
```
