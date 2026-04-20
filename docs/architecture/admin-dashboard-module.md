# MÓDULO: PAINEL ADMINISTRATIVO E INDICADORES (BI INSTITUCIONAL)

## 1. ARQUITETURA DO PAINEL
O Painel Administrativo ("Dashboard Executivo") opera como o centro de comando neural da instituição.
Devido às grandes massas de dados contidas no Firebase (milhares de acessos e resoluções de simulados por alunos reais), **não realizaremos agregações do lado do cliente (App React)**. Ao invés disso, utilizamos N8n e Cloud Functions para escrever resumos estatísticos em uma coleção super-rápida chamada `indicadores_bi`.
Assim, a interface web apenas constrói os gráficos lendo um único documento: `indicadores_bi/instituico_atual`.

## 2. A COLEÇÃO `indicadores_bi` (Firebase View)
Isola as métricas de performance no Firebase de forma barata.
```json
{
  "totalUsersActivos": 450,
  "totalConvitesPendentes": 23,
  "distribuicaoPerfis": { "ALUNO": 400, "PROFESSOR": 40, "ADMIN": 10 },
  "tokensIA_Consumidos_Mes": 240500,
  "onboardingStats": { "completos": 420, "pendentes": 30 },
  "riscoPedagogicoAlunos": 12,
  "updatedAt": "2026-04-20T12:00:00Z"
}
```

## 3. AS ESTRUTURAS DAS TELAS (UX Administrativo)

### 3.1 CCoop (Centro de Controle Operacional) `/admin/dashboard`
- **Público**: Diretoria e Administradores Base.
- **Widgets Superiores (KPIs)**: Total de Alunos, Turmas Ativas, Consumo de Tokens (Barra de Progresso do Budget do Mês), Onboardings Pendentes.
- **Gráficos (Charts)**:
  - *Crescimento Mensal de Acessos* (Linhas Curvas / Tendência Mensal).
  - *Uso por Módulo* (Gráfico de Rosca - Gamificação vs Simulados vs IA).
- **Ações Rápidas**: "Re-disparar convites pendentes", "Bloquear acesso massivo".

### 3.2 Painel de Auditoria e Logs `/admin/logs`
- Lẽ a coleção estourada `logs` onde cada linha contém quem apagou o quê e quem autorizou o quê no banco, cruzando com IDs de coordenadores. Ideal para compliance e auditoria.

### 3.3 Relatórios de Risco e Consumo de IA `/reports`
- **Custo/IA**: Monitores onde o n8n injeta anomalias: *"O Aluno X consumiu 15.000 tokens em 1 hora conversando com Tutor. Pode estar burlando sistema"* (Aleria visível na UI em flag vermelha).

## 4. O WORKFLOW N8N (O Operário por trás)
Para preencher o `indicadores_bi`, arquitetamos um cronjob no n8n.
- **Workflow "Daily Snapshots"**:
  1. Às 03:00 AM (CRON).
  2. N8n executa agregação das contas por `perfil`.
  3. Soma no Firebase `uso_ia` os consumos do dia anterior.
  4. Realiza Write em `indicadores_bi/instituico_atual`.
- **Workflow "Alertas Críticos de Direção"**:
  1. Se a soma do consumo de Tokens do mês passar de 80% do teto, o n8n envia a `BroadcastMessage` (do módulo de notificações) com alta prioridade para todos no papel `ADMIN`.

## 5. REGRAS DE ACESSO E SEGURANÇA
Conforme já consolidado nas Regras Globais do Firebase (do épico de Vínculos/Segurança):
- Apenas `ADMIN` faz read da coleção total `logs` com bypass `allow read: if isAdmin()`.
- Coordenadores enxergam uma variação minimizada do BI referente **apenas às turmas deles**.
- Usuário sem autorização é jogado pelo react-router `AuthGuard` na rota original automaticamente, negando acesso aos indicadores corporativos.

## 6. ROADMAP DO DASHBOARD
- **Dia 1**: Converter a Tela `Dashboard` padrão (que atualmente diz apenas "Bem-vindo") em três painéis diferentes que reagem condicionalmente de acordo com o `profile.perfil` (Painel Diretor, Painel Coordenador, Painel Aluno).
- **Dia 2**: Integrar biblioteca visual `recharts` ou `d3` (no padrão de design instruído), com Cards que se sustentam consumindo o Mock inicial do `indicadores_bi`.
- **Dia 3**: Religar o Front-end dos Painéis de IA e Gamificação nos Analytics unificados.
