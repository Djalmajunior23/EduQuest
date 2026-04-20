# Especificação de Segurança - Módulo de Gamificação

## Invariantes de Dados
1. **Identidade Estrita**: Um registro de `gamificacao` (perfil) só pode pertencer a um `alunoId` que corresponda ao `request.auth.uid`.
2. **Integridade de Saldo**: O `xpAtual`, `pontosTotais` e `saldoTokensIA` não podem ser decrementados (exceto tokens por uso) ou inflados artificialmente pelo cliente.
3. **Imutabilidade de Origem**: Prazos de criação (`createdAt`) e IDs de vinculação (`alunoId`, `trilhaId`) são imutáveis após a criação.
4. **Validação de Relacionamento**: Missões e Desafios devem estar vinculados a uma Trilha ou Unidade Curricular existente.
5. **Estado Terminal**: Missões e Desafios marcados como `CONCLUIDA` não podem retornar ao estado `EM_ANDAMENTO`.

## The "Dirty Dozen" Payloads (Ataques Identificados)
1. **Identity Spoofing**: Aluno A tentando atualizar o XP do Aluno B.
2. **XP Inflation**: Aluno enviando um `update` direto aumentando seu XP em 1.000.000.
3. **Token Stealing**: Aluno tentando gastar tokens de outro usuário.
4. **Relational Orphaning**: Criar um progresso de missão para um ID de missão que não existe.
5. **History Deletion**: Aluno tentando apagar seu `historico_pontos` para esconder irregularidades.
6. **Admin Escalation**: Aluno tentando se adicionar na coleção `admins` ou mudar seu perfil para `ADMIN`.
7. **Negative Balance**: Tentar atualizar o saldo de tokens para um valor negativo.
8. **Replay Attack**: Tentar processar o mesmo `eventos_gamificacao` múltiplas vezes (resolvido por `processado: true`).
9. **Bypassing Prerequisites**: Iniciar uma missão de uma trilha que o aluno ainda não desbloqueou.
10. **Shadow Key Injection**: Adicionar campos como `isCertified: true` ou `isAdmin: true` em documentos de perfil.
11. **ID Poisoning**: Usar um ID de documento de 1MB para causar estouro de custo de armazenamento.
12. **Public PII Access**: Aluno tentando ler a coleção `usuarios` para pegar e-mails e telefones de outros alunos.

## Estratégia de Testes
Os testes devem garantir que qualquer escrita nas coleções de `progresso_*`, `historico_*` e `gamificacao` (perfil) passe pela validação de esquema `isValid[Entity]` e verifique se o autor é o dono.

---
*Documento gerado pelo Especialista em Firebase para o Sistema Interativo de Aprendizagem.*
