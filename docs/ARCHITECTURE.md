# Nexus Pro - Arquitetura e Especificação do Sistema

Este documento define a arquitetura, estrutura e especificação completa da plataforma educacional inteligente, gamificada e multi-tenant **Nexus Pro**.

---

## 1. Visão Geral do Produto
A **Nexus Pro** é uma plataforma EdTech moderna em modelo SaaS, projetada para:
- **Alunos (Jovens/Adolescentes):** Aprenderem tecnologia (Dev, Cyber, Linux) com clareza, gamificação e mentoria por IA.
- **Professores:** Terem uma central pedagógica robusta, com IA atuando como assistente na geração de atividades, simulados e análise de risco.
- **Gestores (Tenants):** Administrarem suas instituições, com BI educacional integrado e whitelabel branding.

---

## 2. Púbico-Alvo
- **Alunos:** Jovens e adolescentes (cursos técnicos, profissionalizantes).
- **Cursos:** Técnico em Desenvolvimento de Sistemas, Informática, Cibersegurança, etc.
- **Clientes (B2B/B2C):** Escolas técnicas, pólos educacionais, professores independentes e alunos diretos.

---

## 3. Arquitetura da Solução e Técnica

### 3.1 Frontend
- **Framework:** React 18+ com TypeScript e Vite.
- **Estilização:** Tailwind CSS + Radix UI / Shadcn UI para acessibilidade e design consistente.
- **Roteamento:** React Router DOM (v6+).
- **Gerenciamento de Estado:** Zustand (estado global) e React Query (dados assíncronos e cache).
- **Gráficos:** Recharts para dashboards analíticos.

### 3.2 Backend (Firebase - BaaS)
- **Autenticação:** Firebase Auth (Email/Senha, Google, Microsoft).
- **Banco de Dados:** Cloud Firestore (NoSQL adaptado para Multi-tenant).
- **Armazenamento:** Firebase Storage (arquivos, uploads).
- **Segurança:** Firebase Security Rules (ABAC/RBAC).

### 3.3 Automação (n8n hospedado em VPS)
- **Plataforma:** n8n rodando via Docker + Traefik.
- **Função:** Orquestrar automações de onboarding, alertas de risco pedagógico, emissão de certificados, processamento de pagamentos temporários e motor inteligente de envio de e-mails.

### 3.4 Inteligência Artificial
- **Gateway Abstrato:** Serviço central no React que roteia chamadas.
- **Provedores:** Google Gemini (principal, usando @google/genai).
- **Regras:** Professores têm acesso a modelos avançados; Alunos têm limites estritos (tokens controlados no Firestore) focados em dicas socráticas.

### 3.5 Camada SaaS
- **Tenants:** Cada instituição é um tenant (`tenantId`). Usuários avulsos caem no tenant "Nexus".
- **Assinaturas:** Stripe e Mercado Pago gerenciam os tiers (Free, Basic, Pro, Institucional).

---

## 4. Estrutura de Código Recomendada (React + Firebase)

```text
src/
├── app/                  # Configuração global (providers, rotas principais)
├── components/           # Componentes UI reutilizáveis (Layout, Botões, Cards)
│   ├── ui/               # Componentes headless/shadcn
│   └── shared/           # Componentes de negócio compartilhados
├── constants/            # Constantes globais (Planos SaaS, Roles, Variáveis)
├── hooks/                # Custom hooks (uso de IA, Firestore, Auth)
├── lib/                  # Configurações de bibliotecas (Firebase, Utils)
├── modules/              # Domínios de negócio separados por feature
│   ├── admin/            # Telas administrativas
│   ├── student/          # Telas do aluno (Trilhas, Mentor, Dash)
│   ├── teacher/          # Telas do professor (Planejamento, BI)
│   └── saas/             # Gerenciamento de planos, assinaturas e pagamentos
├── pages/                # Views principais que empacotam módulos
├── routes/               # Definição de roteamento e Auth/Role Guards
├── services/             # APIs externas, chamadas Firebase diretas, Webhooks N8N
├── store/                # Estado global (Zustand)
├── types/                # Definições de interfaces TypeScript globais
```

### 4.1 Exemplo de Integração IA Centralizada (services/aiService.ts)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const aiService = {
  async generateCorrection(studentAnswer: string, expectedAnswer: string) {
    // Exemplo de uso de modelo mais leve para análises rápidas
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Avalie esta resposta: "${studentAnswer}". Resposta esperada: "${expectedAnswer}". Dê feedback socrático.`
    });
    return response.text;
  }
}
```

---

## 5. Infraestrutura Automática: Docker Compose (n8n + Traefik)

Arquivo `docker-compose.yml` para rodar na Hostinger/VPS Ubuntu.

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=seuemail@dominio.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - web

  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    environment:
      - N8N_HOST=n8n.seudominio.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.seudominio.com/
      - GENERIC_TIMEZONE=America/Sao_Paulo
    volumes:
      - n8n_data:/home/node/.n8n
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.n8n.rule=Host(`n8n.seudominio.com`)"
      - "traefik.http.routers.n8n.entrypoints=websecure"
      - "traefik.http.routers.n8n.tls.certresolver=myresolver"
    networks:
      - web

volumes:
  n8n_data:

networks:
  web:
    external: true
```

---

## 6. Modelagem Firestore Mestre

A estrutura NoSQL garante o conceito Multi-tenant e escalabilidade.

- `/users/{userId}`: Perfil, `tenantId`, `role` (ALUNO, PROFESSOR, ADMIN), `plano` (FREE, PRO).
- `/instituicoes/{tenantId}`: Configurações de branding, limites da escola, permissões globais.
- `/cursos/{cursoId}`: Trilhas acadêmicas, `tenantId`.
- `/turmas/{turmaId}`: Agrupamento de alunos e professores, `cursoId`.
- `/trilhas/{trilhaId}`: Módulos de conhecimento (Ex: Fundamentos de Redes).
- `/missoes_gamificadas/{missaoId}`: Desafios curtos atrelados ao motor de gamificação.
- `/resultados_estudantes/{resultadoId}`: Notas, progresso de trilhas (usado no BI).
- `/logs_ia/{logId}`: Registro de tokens usados, `userId`, custo estimado (para Billing).
- `/assinaturas/{subscriptionId}`: Controle de pagamentos Stripe por usuário/tenant.

> **Segurança:** O `tenantId` deve estar em todas as entidades criadas pelo usuário para que a Regra do Firestore limite operações: `allow read: if resource.data.tenantId == request.auth.token.tenantId;`

---

## 7. IA do Professor e Estratégia de Custos

O professor possui um "Assistente IA" capaz de:
1.  **Geração Pedagógica:** Criar rubricas, SA (Situações de Aprendizagem) completas em minutos baseadas nas competências cadastradas (MEC/Catálogo Téc).
2.  **Análise de Alunos em Risco:** Cruzar notas e tempo de uso para sugerir e gerar um plano de recuperação em cliques.

**Otimização de Custos:**
- **Modelo Leve (Flash):** Usado para formatação, classificação de textos de usuários. (Custo baixíssimo/Grátis na tier).
- **Modelo Pesado (Pro):** Usado APENAS quando o professor pede para gerar uma SA complexa ou análise profunda de turma.
- Alunos têm um limite diário de "Tokens IA" para dicas. Abusos geram fallback para mensagens cacheadas.

---

## 8. Funcionalidades do Aluno (Gamificação e Retenção)
- **Tutor IA (Mentor):** Responde a dúvidas focadas nas Trilhas ativas.
- **Boss Challenges:** Finais de módulo práticos (ex: Subir servidor Apache e testar em laboratório), enviados via upload e avaliados por IA + Professor.
- **Revisão Espaçada:** O n8n agenda webhooks diários que enviam quizzes proativos para alunos via plataforma (Flashcards baseados em erros passados).

---

## 9. Webhooks N8N (Exemplos de Automação)
- **Gatilho Cadastro:** Quando Firebase cria usuário -> n8n manda e-mail de boas-vindas com Link de Mágica (Magic Link) e gera métrica inicial no BI.
- **Gatilho Billing:** Stripe confirma pagamento de "Plano Institucional" -> n8n altera plano no Firestore `/instituicoes` -> n8n manda e-mail para dono da escola de "Acesso Liberado".
- **Sincronia de Gamificação:** O aluno bate um Streak de 7 dias -> Frontend chama webhook -> n8n valida no banco e adiciona +100 XP e badge "Desbravador da Semana".

---

## 10. Roadmap de Implantação

**Fase 1 (MVP - Concluída na base atual):** Login, Dashboards estáticos, Perfis (Aluno, Professor, Admin), Identidade Visual (Nexus Pro), Configuração do Modelo SaaS Básico.
**Fase 2:** CRUDs Pedagógicos (Gerenciamento de Cursos, Turmas e Módulos).
**Fase 3:** Motor de Avaliação, IA geradora de questões para professores, Integração Oficial do Simulador Múltipla Escolha.
**Fase 4:** Gamificação Acadêmica Real-Time (Cálculo de XP no firebase side, destravamento de conquistas).
**Fase 5:** Implantação do N8N na VPS, Configuração do Gateway (Stripe) e Integração de Billing com webhook.
**Fase 6:** Painéis Avançados Institucionais (BI Multi-tenant real).🚀
