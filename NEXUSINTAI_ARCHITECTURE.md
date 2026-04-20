# NEXUSINTAI — Especificação Técnica e Arquitetural (SaaS Educacional)

## 1. VISÃO GERAL DA PLATAFORMA
**NEXUSINTAI** é uma plataforma educacional moderna, voltada para o ensino profissional e técnico, operando sob um modelo SaaS multi-tenant. A plataforma engaja jovens e adolescentes iniciantes em tecnologia (ex: alunos de Desenvolvimento de Sistemas, Redes e Cibersegurança) por meio de gamificação educacional profunda, trilhas adaptativas e automação pedagógica. Para os professores e gestores, atua como uma central de controle e produtividade turbinada por Inteligência Artificial (IA) e fluxos (workflows) automatizados via n8n.

## 2. PÚBLICO-ALVO
*   **Alunos:** Jovens e adolescentes, especialmente em cursos técnicos (Sistemas, Web, Linux, Cibersegurança, etc). Precisam de engajamento constante, feedback imediato e gamificação que recompense de forma justa.
*   **Professores:** Profissionais que lidam com turmas diversas e precisam ganhar tempo em planejamento, correção, acompanhamento e intervenções pontuais.
*   **Gestores/Instituições:** Coordenadores e escolas técnicas que buscam um SaaS "white-label" / multi-tenant para gerenciar alunos, assinaturas, pagamentos e métricas via dashboards robustos de BI.

---

## 3. ARQUITETURA TÉCNICA COMPLETA

*   **Frontend (Camada de Apresentação):** 
    *   React 18+ com TypeScript construído com Vite.
    *   Tailwind CSS para estilos globais e UI responsiva.
    *   React Router v6 para roteamento e controle de acesso hierárquico.
    *   Zustand para estados globais do App (Auth, Ui State) acompanhado de React Query para cacheamento de buscas do DB.
    *   Recharts para gráficos de BI Educacional (radares de habilidades, barra de progresso).
*   **Backend (BaaS - Backend as a Service):**
    *   **Firebase Authentication:** Para provisionamento ágil de usuários com JWT, suportando perfis dinâmicos (Roles).
    *   **Cloud Firestore:** Banco NoSQL distribuído escalável em tempo real.
    *   **Firebase Storage:** Hospedagem de materiais, PDFs e imagens anexadas.
*   **Camada Lógica Assíncrona e Automação (Motor Inteligente):**
    *   **n8n hospedado (VPS):** Ferramenta de automação rodando fluxos por webhook. Gerencia regras pesadas como distribuição massiva de missões, correções complexas com IA assíncrona, alertas de desengajamento e integração em lote com ERP via APIs.
*   **Inteligência Artificial Integrada:**
    *   Uso de provedores de IA (como Gemini 1.5, OpenAI GPT-4o-mini). Abstração na camada frontend ou n8n de fallback (onde prompts corriqueiros vão para a API gratuita limitando custos e as complexas como "Gerar plano de Aula e SA Completo" vão para IA premium com dedução de "Tokens" do Tenant/Professor).
*   **Acesso e Billing (SaaS):**
    *   Integração Mercado Pago / Stripe, controle de inadimplentes barrando rota com React Context.

---

## 4. CÓDIGO BASE REAL — REACT + FIREBASE

### 4.1 Estrutura de Pastas de Referência
```text
src/
 ├── components/       # Componentes burros, botões, modais (ui/), etc.
 ├── hooks/            # Hooks customizados (useAuth, useTenant)
 ├── layouts/          # Estruturas base de tela (AdminLayout, AppLayout, AuthLayout)
 ├── lib/              # Configurações raiz: firebase.ts, utils.ts, n8nClient.ts
 ├── modules/          # Divisão por domínio (student/, professor/, admin/)
 ├── pages/            # View components principais do roteador (Dashboard, Login)
 ├── routes/           # Mapeamento do react-router-dom, AuthGuards e Roles
 ├── services/         # Handlers externos (AI, Stripe, Firestore Facades)
 ├── store/            # Zustand global state persistido
 ├── types/            # Interfaces centrais (User, Tenant, Mission)
 └── App.tsx           # Entrypoint da árvore de roteamento
```

*(O projeto atual já exemplifica grande parte desta estrutura utilizando `src/modules` e `src/pages` com `lib/AuthContext`)*

---

## 5. INFRAESTRUTURA — DOCKER COMPOSE PARA N8N + TRAEFIK

### O `docker-compose.yml` para VPS robusta e SSL:
Um exemplo de infraestrutura n8n protegido por HTTPS com Traefik Reverse-Proxy para receber webhooks do Firebase seguramente:

```yaml
version: "3.7"
services:
  traefik:
    image: "traefik:v2.10"
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=admin@nexusintai.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "./letsencrypt:/letsencrypt"
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
    networks:
      - n8n_net

  n8n:
    image: n8nio/n8n:latest
    restart: always
    environment:
      - N8N_HOST=n8n.nexusintai.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.nexusintai.com/
      - GENERIC_TIMEZONE=America/Sao_Paulo
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - n8n_net
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.n8n.rule=Host(`n8n.nexusintai.com`)"
      - "traefik.http.routers.n8n.entrypoints=websecure"
      - "traefik.http.routers.n8n.tls.certresolver=myresolver"

networks:
  n8n_net:

volumes:
  n8n_data:
```

---

## 6. ARQUITETURA SAAS MULTI-TENANT AVANÇADA

*   **Identificação:** No Firestore, a base de usuários mantém um campo `tenantId` (`string`).
*   **Isolamento Firestore Rules:** Nenhuma consulta sem `where("tenantId", "==", currentUser.tenantId)` terá sucesso. Regra Global de Firestore exige `resource.data.tenantId == request.auth.token.tenantId`.
*   **Hierarquia:** `Tenant (Escola)` > `Curso` > `Turma` > `Usuário`. Todo documento gerado num tenant herda o `tenantId`.
*   **Configurações e Limites:** Na doc do Tenant, guardamos objetos `billingInfo` (API status do stripe), `limits` (número máximo de alunos: 100), e `branding` (cores e logos da IES).

---

## 7. INTEGRAÇÃO COM PAGAMENTOS (STRIPE)

Fluxo automatizado assinado:
1.  Admin acessa configuração de conta.
2.  Redirecionamento para Stripe Checkout referenciando o `tenantId` nos *metadata* do webhook.
3.  Webhooks do Stripe `invoice.payment_succeeded` ou `customer.subscription.deleted` são recebidos por um webhook no **n8n** (ou Firebase Function caso opte).
4.  O N8N atualiza no database `tenants/{tenantId}` a *flag*: `statusAssinatura: 'ATIVA' | 'VENCIDA'`, alterando permissões online globalmente.
5.  Em caso de inadimplência, toda a URL (via AuthGuard ou `App.tsx`) é desviada para uma tela suspensa, barrando navegação no Tenant inteiro.

---

## 8. MÓDULOS DO SISTEMA

*   **Módulo Aluno:** Painel de missões (gamificação diária), mapa de fases estilo Duolingo por Curso, Simulados interativos, motor de tutor virtual no canto, agenda de entregas e Relatório de Competências adquiridas.
*   **Módulo Professor:** Banco de Questões Inteligente, Planejamento e disparo de SAs (Situação e Atividade), Visualização de engajamento do aluno (Gráfico Radar de Risco vs Participação), Criação de Rubricas.
*   **Módulo Administrador Geral / Instituição:** Gestão CRUD de cursos, turmas, limites e relatórios consolidados institucionais, acompanhamento financeiro SaaS.

---

## 9. IA PODEROSA DO PROFESSOR

*   **Gerador de Contextos:** Na hora de o educador adicionar questões, ele interage com o "Gerador Pedagógico Inteligente". Entra com um sub-tema (ex: TCP/IP avançado), define o Foco e a Taxonomia de Bloom (Analisar, Avaliar, Criar).
*   A IA (usando contexto da Turma + ementa da UC via embeddings textuais leves enviados no prompt) retorna em JSON (Schema restrito no LLM) 5 itens com opções, gabaritos e textos motivacionais de explicação, gravando isso de forma isolada ao DB.

---

## 10. MODELOS DE IA: OTMIZAÇÃO E CUSTOS (Tokens e Fallbacks)

*   **Orquestração Híbrida:** 
    *   **Tier Free / Leve (ex: Gemini Flash/GPT-4o-Mini):** Respostas diárias do Tutor Virtual para o aluno, dúvidas curtas e pontuais sobre um trecho do simulado. Respostas baratas.
    *   **Tier Premium (ex: Gemini 1.5 Pro):** Criação de Planos de Curso, análise minuciosa de textos de defesa descritiva dos estudantes de TCC ou de SAs densos.
*   **Economia:** Implementar controle via `tokens_ia` do Tenant. Cada chamada subtrai os tokens com base no usage report enviado pelas APIs. Professor visualiza limite gasto x mensal disponível no `pricing`.

---

## 11. REFORÇO, APRENDIZADO E RETENÇÃO AUTOMÁTICA

*   **Curva do Esquecimento (Revisão Espaçada):** Se o aluno erra gravemente Redes na UC inicial. O sistema agendado no N8N emite "Flashcards" no calendário do aluno após 1, 3 e 7 dias disfarçados de *Mini-Boss*.
*   **Tutor Virtual:** Botão persistente em flutuação informando dicas baseadas na meta atual do mapa. E.g: "Fulano, vi que seu simulado escorregou em UX, a próxima fase é densa nisso, estude PDF anexado".

---

## 12. GAMIFICAÇÃO EDUCACIONAL AVANÇADA

Implementada nas sub-collections `ranking`, `gamificacao_missoes`, `gamificacao_progresso_missoes` e `badges`.
1.  **XP Acumulativa:** Tudo vale pontos. Presença passiva (1xp), entregar desafio difícil no prazo (500xp), responder fórum.
2.  **Ligas vs Ranking Fixo:** Alunos agrupados de 20 em 20 competem por Ligas semanais (Bronze para Prata). Impede o efeito desmotivador de "top ranking inalcançável".
3.  **Streaks de Fogo:** Bateu o App no dia, concluiu pelo menos um mini quiz = "Chama". Mantém retenção orgânica diária no SaaS.

---

## 13. BI E MOTOR INTELIGENTE (Insights & Painéis)

*   Motor executado pelo `N8n` consolidador:
    A cada madruga o N8n recalcula `indicadores_bi`. Exemplo `taxa_acerto_uc_1`. No React, o componente com **Recharts** assina esse doc do Firebase e exibe num radar, sem queimar milhares de *reads* (pois o n8n sumariou tudo no backend off peak).
*   **Alertas:** Aluno que perdeu 3 desafios entra na coleção `alertas` (risco acadêmico), que é despachada para o e-mail ou dashboard central do professor da trilha.

---

## 14. SELETORES DO FIRESTORE — MODELAGEM

Coleções essenciais otimizadas:

1.  **`tenants/{tenantId}`** (Info assinador, nome fantasia, cores config).
2.  **`users/{uid}`** (Perfis, Role: ALUNO/PROFESSOR/ADMIN).
3.  **`cursos/{cursoId}/turmas/{turmaId}`** (Acomoda sub-docs relacionais).
4.  **`questoes/{questaoId}`** (Itens atômicos do banco indexados com array-contains para tags e disciplina).
5.  **`simulados/{simuladoId}/respostas/{respostaId}`** (Padrão de coleção de alta gravidade write separada, facilita contagem via Aggregation DB).
6.  **`ranking/{userId}`** (Apenas docs achatados e sumarizados do progresso para consumo relâmpago frontal sem pesar custo DB Data).

*Segurança base:* Tudo protegido pelo `match /...` onde `request.auth` contém `uid` válido ou restrição via Cloud Functions injects no Token JWT `admin: true`.

---

## 15. N8N AUTOMATION (Exemplo: Flow de Notificação Semanal e Streaks)

Workflow do Motor Analítica Semanal:
*   `Trigger (Cron)` -> toda segunda, 2h AM.
*   `Node HTTP (Firebase REST)` -> Puxa a lista de IDs de usuários ativos na última semana.
*   `Code Node (JS)` -> Calcula alunos sem acesso nos últimos 5 dias (risco).
*   `Node HTTP (SendGrid / Email / WebSocket)` -> Despacha avisos para a coordenação em formato de Batch (resumo em tabela HTML).
*   `Node HTTP (Firebase Firestore)` -> Zera contadores semanais de ligas e distribui baús novos aos destaques.

---

## 16. TELAS E APLICATIVO

Interface guiada por `TailwindCSS`. Tudo construído via "mobile-first", especialmente para alunos.

*   `DashboardAluno`: NavTop bar clara, Sidebar para Profile/Config. Corpo principal contendo um Componente de "Trilha SVG/CSS" interativa, estilo Duolingo. Botões flutuantes para chat e recompensas.
*   `DashboardProfessor`: Focado em Produtividade "Bento Grid". Cartões enormes com atalhos numéricos vivos: "3 alunos precisando atenção", "Gerar Atividade de IA com 1 Click".
*   `DashboardAdmin`: Relatórios tubulares e de linha com Date-Pickers e gestão de Tenants / Contratos.

---

## 17. GOVERNANÇA E SEGURANÇA (Multi-tenant Zero Trust)

*   Utilizar **Custom User Claims** no Firebase Auth para não precisar checar o doc `user/{uid}` a cada call sensível. Injetamos o `tenantId` e controle direto no JWT.
*   **Firestore Rules** restrito sob o padrão `affectedKeys().hasOnly(['field'])` nas atualizações de Status Terminal.
*   Auditoria dos prompts e inputs da IA rodando por filtros de Content Moderation para segurança contra toxidade em ambiente adolescente-educacional (*SafeSearch* habilitado obrigatório na GenAI API).

---

## 18. DEPLOY

*   **PWA SPA Frontend:** Hosted estaticamente sem custos na CloudFlare Pages ou via Cloud Run / Firebase Hosting (Vite Output). Rápido, edge-caching puro.
*   **N8n / Automações Core:** 1 Droplet/VPS Ubuntu na DigitalOcean. Instalado Traefik, Docker Compose, configurado porta 80 e 443 apontando pro IP. Firewall habilitado. Variáveis injetadas localmente em arquivo `.env`.

---

## 19. MONETIZAR O NEGÓCIO EM SAAS

*Planos de Custo Estimado e Upselling (Stripe):*
*   **Free School (Pública/Teste):** Bloqueio para 50 alunos máximo. Nenhuma IA avançada. Relatórios básicos em PDF. Max 1 Admin.
*   **Profissional PME:** Max 500 Alunos. Limites de 2.000 prompts de IA e 1 N8n Tenant Integration mensal. Custo Mensal ou por Cabeça (`seat`). Assinaturas Recorrentes.
*   **Enterprise:** Sem limites. Conexões de AD Institucional. Base de Dados isolada, Webhooks com API Própria sem Rate Limits rígidos. Custos altos, ciclos de negociação longos (Contato Custom via Site Vendas).

---

## 20. ROADMAP DE EXECUÇÃO EM "SPRINTS" ÁGEIS

*   **SPRINT 1 (A BASE):** Autenticação escalada. Firestore. Models de base. Estrutura do React. Perfis Base criados e funcionando CRUD.
*   **SPRINT 2 (ACADÊMICO):** Cursos, Turmas e Mapeamentos curriculares UC (Tutor Insere os conteúdos).
*   **SPRINT 3 (PRODUTOR DE CONTEÚDO E TESTES):** Banco de questões (Manual e com AI Básica de Contexto) -> Construir Telas do Prof e Teste.
*   **SPRINT 4 (ENTREGA ALUNO):** Visualizar missões e o painel de avaliação/simulados em estilo gamificado (mapas e progress bars). Trilha Baseada Em Resultados.
*   **SPRINT 5 (A AUTOMATIZAÇÃO - N8N):** Implantar VPS N8n para interconectar Relatórios Assíncronos semanais e BI de Professor Inteligente (Calculador de Risco).
*   **SPRINT 6 (BUSINESS ENGINE SAAS):** Plugar Billing da Stripe. Bloqueadores de tela de plano não-pago.

---

> Esse documento abrange as perspectivas para implantação de uma plataforma educacional inteira (EdTech SaaS) operando no formato de gamificação moderna interconectada, BI e apoio via GenAI. A tecnologia provada e emparelhada do React, Tailwind e motor Serverless provém as chaves para alta retenção escolar técnica do ecossistema pretendido.
