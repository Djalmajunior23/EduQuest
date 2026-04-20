# MÓDULO DE GESTÃO DE PERMISSÕES GRANULARES (RBAC + ABAC)

## 1. ARQUITETURA DO MÓDULO
O sistema utiliza uma arquitetura **Híbrida de RBAC (Role-Based Access Control) com injeção de ABAC (Attribute-Based Access Control)**. 
Para otimização extrema no Firestore (evitando N+1 reads), utilizamos o conceito de **"Compiled Permissions"**.
1. **Roles (Perfis Básicos)**: ADMIN, PROFESSOR, ALUNO possuem pacotes padrão de permissões.
2. **Granular Permissions (Exceções)**: Usuários recebem permissões extras via array `permissoesGranulares`.
3. **Resolução de Acesso**: A checagem de poder (Frontend e `firestore.rules`) verifica se a permissão exigida existe na Herança do Perfil OU nas permissões granulares injetadas.

## 2. ESTRUTURA DE TELAS A SEREM IMPLEMENTADAS
- **Painel Matriz de Permissões (`/admin/permissions`)**
  - *Objetivo*: Visualizar e aplicar toggles rápidos de acesso a funcionalidades agrupadas.
  - *Componentes*: Matriz de Toggles, Tabs por Perfil (Admin, Coord, Prof), Accordions por Grupo (Acadêmico, Gamificação, IA).
- **Painel de Exceções de Usuário (Integrado no `UserManager`)**
  - *Objetivo*: Adicionar permissões específicas a um usuário sem subir o nível inteiro do perfil dele.
  - *Componentes*: Modal de inspeção do usuário com "Permissões Extras", botão de "Revogar Acesso".
- **Logs de Segurança**
  - *Objetivo*: Interface readonly demonstrando quem concedeu/revogou poder de quem.

## 3. COLEÇÕES DO FIREBASE (FIRESTORE)

### Coleção: `perfis` (Role Definition)
- **Objetivo**: Armazenar os pacotes base de permissões de cada cargo.
- **Campos**: `id`, `nome`, `permissoes_padrao` (Array), `ativo`, `isSystem` (Boolean).
- **Regras**: Somente ADMIN altera.

### Coleção: `usuarios` (User Document expandido)
- **Campos Adicionados**: 
  - `permissoesGranulares` (Lista de strings ex: `['acessar_logs', 'usar_ia_professor']`)
- **Regras**: `allow update: se (isAdmin() OU hasPermission('gerenciar_permissoes'))` e prevenir autoelevação.

## 4. REGRAS DE NEGÓCIO E SEGURANÇA
1. **Prevenção de Autoelevação**: Um usuário, mesmo com direito de `editar_usuario`, não pode injetar `gerenciar_permissoes` ou `ADMIN` no seu próprio perfil.
2. **Herança Prioritária**: A remoção de uma permissão granular não anula a permissão caso ela seja do pacote base do Perfil do usuário. Para negar algo do perfil base, seria necessário alterar o Perfil nativo.
3. **Tombamento Analítico**: Toda mudança nas `permissoesGranulares` obrigatoriamente gera um registro na coleção `/logs` tipo `PERMISSION_GRANTED` ou `PERMISSION_REVOKED`.

## 5. EXEMPLOS PRÁTICOS APLICADOS
- *Cenário A*: Um Professor que vira o "Ponto Focal" de uma área. Mantenho o perfil como `PROFESSOR` estruturalmente, mas injeto as permissões granulares: `['gerenciar_turmas_globais', 'visualizar_relatorios_institucionais']`.
- *Cenário B*: Um Assistente Administrativo entra na plataforma. Cargo: `SUPPORT`. Permissões base: `visualizar_bi`. Adm injeta: `['redefinir_senha', 'bloquear_usuario']`. Ele consegue resolver tickets sem ter poder de apagar sistema.

## 6. ROADMAP DE IMPLEMENTAÇÃO
- [x] **Fase 1**: Refatorar `AuthContext` e `firestore.rules` para suportar a helper `hasPermission()`.
- [x] **Fase 2**: Criar componentes Visuais (Toggles, Badges, Matriz) e a Nova Tela de Gestão.
- [ ] **Fase 3**: Modularizar a edição de grupos dinâmicos no banco.
- [ ] **Fase 4**: Triggers do Firebase/n8n para monitorar injeções ilícitas de acesso.
