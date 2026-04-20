# MASTER PLAN: GOVERNANÇA, GESTÃO E ADMINISTRAÇÃO

## 1. ARQUITETURA INTEGRADA DOS MÓDULOS (TOPOLOGIA)
O ecossistema é projetado sob uma arquitetura **Serverless & Event-Driven**, separando responsabilidades de front-end, back-end assíncrono e banco de dados:
- **Frontend (HostGator)**: Aplicação React/Vite exportada como SPA Estática (`npm run build`). Escalabilidade infinita via CDN/Apache Edge, conectando nativamente ao Firebase Client SDK.
- **Banco de Dados (Firebase)**: Autenticação, Firestore (NoSQL) para estado global em tempo real e regras de segurança rígidas, imprensando a lógica de Permissões (RBAC).
- **Motor de Automação (Hostinger VPS)**: Instância autogerenciada do `n8n`. Atua como "Backend Worker". Conecta-se ao projeto Firebase via Service Account (Admin SDK) para processar métricas pesadas, envios de e-mails, relatórios baseados em CRON e eventos em lote, sem onerar as requisições do cliente.

---

## 2. TELAS E NAVEGAÇÃO ADMINISTRATIVA
O **Painel de Controle** atua em `/admin/*` unificando a experiência com a seguinte navegação modular:
1. **Painel Executivo CCoop (`/`)**: Visão Master (BI, Tokens de IA, Crescimento, Riscos).
2. **Gestão IAM (`/admin/users`)**: Tabela de usuários, CRUD de convites, atribuição de Perfis e Permissões Granulares.
3. **Gestão Acadêmica (`/admin/academic`)**: Hub de Cursos, Turmas e alocação via `AcademicLinks`.
4. **Broadcast & Comunicação (`/admin/communications`)**: Central de disparo de Mensagens Internas.
5. **Auditoria (`/admin/logs`)**: Tabela *Read-Only* de ações sensíveis (emissões de convite, bloqueios).

---

## 3. MODELAGEM FIREBASE (COLEÇÕES CORE)

### 3.1 Gestão de Usuários e Permissões
- `usuarios`: Centraliza o ID do usuário (Firebase Auth). Contém `perfil` (String enum: ADMIN, PROFESSOR, etc) e a super-matriz de `permissoesGranulares` (Array: `['gerenciar_conteudo', 'ver_bi']`). Traz o nó `onboardingStatus`.
- `perfis` (Opcional/Futuro): Dicionário customizável se quisermos abstrair as roles estáticas.

### 3.2 Acadêmico & Vínculos
- `turmas`, `cursos`, `unidades_curriculares`: Estruturas puras.
- `vinculos_academicos`: Tabela associativa entre `userId` e o nó pedagógico referenciado. Fundamental para não quebrar limites do Firestore e facilitar filtros de acesso.

### 3.3 Comunicação e N8n
- `notificacoes`: Alertas individuais 1:1, como lembretes de avaliações.
- `mensagens_internas`: Avisos em broadcast (1:N), economizando writes de banco.
- `logs`: Coleção alimentada via Client App ou N8n registrando `action`, `adminId` e `targetData`.

---

## 4. FIREBASE SECURITY RULES E AUTORIZAÇÃO
A base de toda a segurança (RBAC) opera no Firebase Validator imprensando acessos:
```javascript
function getUserData() { return get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data; }
function isAdmin() { return getUserData().perfil == 'ADMIN'; }
function hasPermission(perm) { return getUserData().permissoesGranulares.hasAny([perm]); }
```
Qualquer write aos bancos corporativos exigem:
`allow write: if isAdmin() || hasPermission('gerenciador_global');`

---

## 5. INTEGRAÇÕES CÉREBRO: N8N (HOSTINGER)

O verdadeiro poder operacional reside nestes Workflows que deverão ser mapeados visualmente na engine do n8n:
- **WF-1: Motor de Convites**: Listen via webhook ou trigger Firestore node. Um ADMIN salva em `convites`. O N8n dispara e-mail SendGrid formatado e, em caso de expiração (CRON), marca como expirado no banco.
- **WF-2: Cão de Guarda (BI Analytics Diário)**: CRON às 3AM. O fluxo do N8n roda queries agregadas em todo Firestore (Somatório de `tokensIA`, Contagem de `usuarios ativos`). Atualiza o doc master `indicadores_bi/instituicao` (utilizado pelo Admin Dashboard).
- **WF-3: Onboarding Drip Campaign**: Verifica contas que aceitaram termo mas não completaram tutorial. Após 48h, envia DM/Email interativo: *"Falta pouco para dominar a plataforma!"*.

---

## 6. REGRAS DE NEGÓCIO E MECÂNICAS
- **Revogação Instantânea**: Se um Coordenador for rebaixado a Professor por um Admin, o Firebase Listener no cliente dele forçará um *re-render* ocultando as telas proibidas em microssegundos (usando o `AuthGuard` React), além do banco de dados (regras Firestore) não aceitar mais writes caso o cliente burle o front.
- **Privilégio Mínimo (Zero Trust)**: Turma A só pode ser modificada por quem tem `AcademicLink` como Coordenador da Turma A, e não Turma B.
- **Logs Incorruptíveis**: A coleção de auditoria `/logs` tem a regra `allow update, delete: if false;`. Ninguém apaga rastros na plataforma, nem um Admin.

---

## 7. ROADMAP DE EXECUÇÃO (ROLLOUT EM 4 FASES)

### Fase 1: Fundação IAM (Users & Profiles)
- Carga do React Context unificando Auth do Firebase com os dados ricos da coleção de usuários.
- Criação do `/admin/users` (UserManager): Tabela listando contas, permitindo bloqueios dinâmicos, banimentos rápidos e delegação da chave Array de *Permissões Granulares*.

### Fase 2: Malha Acadêmica (Vínculos & Turmas)
- Construção do Painel Hub Acadêmico.
- Engine de arrastar professores para dentro das turmas gerando atomicamente documentos em `vinculos_academicos`, isolando turmas de acessos não autorizados.

### Fase 3: Comunicação & Guia (Onboarding + Notification)
- Conexões finais da UI: O NotificationBell que já produzimos.
- O Frontend Guard (`OnboardingWizard`) travado na frente do usuário recém-convidado ditando a LGPD e captação do número do celular para integrações futuras.

### Fase 4: Inteligência (Governança & BI Dashboard)
- Finalização do `AdminDashboardPanel` exibindo os dados de Risco.
- O deploy das receitas `.json` exportadas dos fluxos N8n para a Hosted Machine da Hostinger completando o circuito de Automação de Alertas e Compilação dos Indicadores Visuais.
