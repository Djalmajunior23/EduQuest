# MÓDULO DE NOTIFICAÇÕES E COMUNICAÇÃO INTERNA

## 1. ARQUITETURA DO MÓDULO
O módulo é divido em duas frentes de dados primárias no Firestore:
- **`notificacoes`** (Notificações Isoladas / 1:1): Uma coleção altamente volátil. Cada documento pertence diretamente a apenas um `userId`. Utilizado para lembretes, alertas de sistema, avisos de tokens e correções de avaliações.
- **`mensagens_internas`** (Comunicação em Massa / 1:N): Para evitar a duplicação de dados, quando um Coordenador tenta mandar um aviso para 200 alunos de 5 Turmas, não criamos 200 notificações. Criamos 1 documento de `BroadcastMessage` contendo a array `targetTurmaIds`. O App Frontend do aluno fará uma consulta simples onde as turmas dele dão match com as turmas da mensagem, unificando a leitura transacional.

## 2. TIPOS DE NOTIFICAÇÃO (ENUMS)
A taxonomia de notificações permite filtros rápidos e definição segura de UX/Ícones na Central do Aluno:
- **INFO**: Informação trivial geral.
- **ALERT**: Suspensões, senhas, timeouts ou alertas do sistema.
- **REMINDER**: Lembrete de data próxima de avaliações e Simulados.
- **ACHIEVEMENT**: Drop de Gamificação, Level Ups ou Recompensas ganhas.
- **ADMIN**: Mensagens emitidas e pinadas por Coordenadores/Administradores (alta prioridade).
- **PEDAGOGICAL**: Avisos criados ou analisados pela IA sobre Risco de Evasão, ou de Professores sobre desempenho do aluno.
- **WELCOME**: Mensagens de Onboarding (completar o perfil, acessar os Termos de Uso).

## 3. ESTRUTURA DE TELAS (`/communications`)

### 3.1 Central de Notificações (Dropdown Header e/ou Tela Cheia)
- **Objetivo**: Stream histórico de todos os eventos 1:1 e mensagens de Massa que o aluno precisa ver.
- **Componentes**: 
  - Caixa de Entrada com Badges ("Não lidas").
  - Botão estático "Marcar todas como lidas".
  - Ícone de sino animado quando ocorrem conexões de Snapshot realtime.
- **Ações**: O `onClick` em qualquer card deve imediatamente disparar para a DB a flag `read: true` e, caso possua `actionUrl`, fazer um redirect (Deep linking simulado no app).

### 3.2 Painel de Comunicação e Transmissão (Admin/Professor)
- **Objetivo**: A interface para o disparo transacional das `BroadcastMessages`.
- **Componentes**:
  - Editor TDD Text area (Markdown support).
  - Toggles/Selects múltiplos para escolher "Turma X", "Curso Y" ou perfis inteiros ("Todos os Professores").
- **Acesso**: Travado pela regra Helper `isProfessor()` ou `isAdmin()`.

### 3.3 Preferências (Abaixo do Perfil de Usuário)
- **Objetivo**: Tela para desligar alertas de Gamificação (que podem incomodar) mas manter alertas prioritários ativados. Toggles locais salvos em `/usuarios/{id}` no object `preferencias`.

## 4. FIREBASE
Conforme injetado no `firebase-blueprint.json`:
- **`notificacoes`** -> Entidade genérica "Notification".
- **`mensagens_internas`** -> Entidade transacional "BroadcastMessage".
Ambos bloqueiam as regras explicitamente para que aluno logado nunca escreva um aviso escolar de broadcast, mas consiga buscar as informações se for autenticado.

## 5. INTEGRAÇÃO N8N (AUTOMAÇÃO E WORKFLOWS DO MOTOR)
Os gatilhos base do Firestore provocam ações no n8n.
- **Reconhecimento Gamificado**: N8n escuta (OnUpdate) a coleção de XP. Se XP bate num marco definido da Badge, o gatilho Firestore cria o documento de Notificação apontando a URL do gif do avatar ("Você subiu de nível!").
- **Alerta de Risco Pedagógico**: O script de Cron (Agendador diário do n8n) pesquisa por submissões vazias de alunos em Simulados que venceram há 3 dias e varre emitindo para o `Notificações` do professor: "Atenção: 5 alunos reprovados ou zerados no Módulo XYZ".

## 6. REGRAS DE NEGÓCIO E SEGURANÇA UX
- **Contexto Blindado**: Na regra Firestore `allow read: if isOwner()`, garantimos que por engenharia reversa no cliente um Aluno X não leia a notificação do Aluno Y.
- **Quiet Mode**: No design da aplicação, o app primeiro checará a variável do documento principal: `user.preferencias.notificacoesEmail == false`. Sendo falso, a trigger do banco é desativada pro envio externo SendGrid, restringindo-se só a pular no Header em formato in-App UI.

## 7. ROADMAP
- **Passo 1:** Criar e instanciar o Notification Service Frontend (o Contexto de Notificações, unindo ContextAPI com a coleção *notificacoes*). Implementado e disponível pro Root do App (Sino Superior).
- **Passo 2:** Painel de BroadCast de Mensagens (Criação).
- **Passo 3:** Conectar Hooks reais nos serviços de Turma / Simulados (que acabam de sair).
