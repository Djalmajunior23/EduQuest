# MÓDULO DE ONBOARDING INTELIGENTE DE USUÁRIOS

## 1. ARQUITETURA DO ONBOARDING
O onboarding adota uma abordagem de **Progression Flow Stateful**. O estado do usuário não é binário (apenas "ativo" ou "inativo"). O fluxo de onboarding exige as etapas: Conta Criada -> Senha Definida -> Termos Aceitos -> Perfil Complementado -> Tutorial Concluído.
Toda essa jornada será governada por campos embutidos no próprio documento de `/usuarios/{userId}`, centralizados no objeto `onboarding`. O sistema trava o acesso às rotas normais da plataforma até que `primeiroAcessoCompleto` seja `true`.

## 2. ETAPAS E TELAS DO FLUXO (UX)
Um componente isolado (ex: `OnboardingGuard` atuando como middleware no React) sequestra a tela caso identifique o Onboarding pendente.
1. **Screen 1: Welcome & Setup (Definição de Senha)**: Caso o aluno tenha entrado por link de convite (n8n). Se entrar via Google OAuth, esta tela pula.
2. **Screen 2: Cyber-Contract (Aceite de Termos)**: Termos de Uso e Política de Privacidade e consentimentos da LGPD, salvando a data exata da assinatura.
3. **Screen 3: Concluindo seu ID (Completar Perfil)**: Se falta telefone, foto/avatar ou data de nascimento, exibe inputs simples estilo "Terminal Typewriter".
4. **Screen 4: Metaverso Tour (Tutorial Guiado)**: 
   - *Professor*: Exibe popups sobre como "Criar uma Situação de Aprendizagem" ou "Gerar Simulado com IA".
   - *Aluno*: Demonstra a "Central de Missões", o "Ranking" e os Tokens.
5. **Finalização**: Animação de `LevelUpCelebration` dando XP de boas-vindas e destravando a aplicação.

## 3. COLEÇÕES FIREBASE (FIRESTORE)

A coleção é a própria `/usuarios`. Adicionamos propriedades estruturadas:
```json
{
  "nome": "João Silva",
  "status": "ATIVO",
  "termosAceitosEm": "2026-04-20T10:00:00Z",
  "primeiroAcessoCompleto": false,
  "onboardingStatus": {
    "etapaAtual": "TUTORIAL",
    "etapasConcluidas": ["SENHA", "TERMOS", "PERFIL"],
    "skippedTutorial": false,
    "lastPromptAt": "2026-04-20T10:05:00Z"
  }
}
```

## 4. WORKFLOWS N8N INTEGRADORES
1. **Disparo de Convite (Invite Flow)**: 
   - Gatilho: Inserção em `/convites`.
   - Ação n8n: Dispara e-mail com UI HTML Neon/Cyberpunk contendo o link de cadastro contendo o `token`.
2. **Lembrete de Ativação**:
   - Agendamento: A cada 2 dias, o n8n busca perfis `status == PENDENTE` no Firestore e manda lembrete. Após 7 dias, muda para `status == INATIVO` e `onboardingStatus.failed = true`.
3. **Chute no Onboarding (Drip Mails)**:
   - Se o usuário criou conta via Google mas nunca logou (faltando aceitar os termos), o n8n envia um e-mail: *"Falta pouco para iniciar sua jornada. Clique aqui para completar seu acesso."*

## 5. REGRAS DE NEGÓCIO DA ARQUITETURA
- **Progressão Retomável**: Se o usuário fecha a aba na etapa 3 e volta amanhã, o `OnboardingGuard` abre imediatamente na etapa 3.
- **Gravação Segura**: O aceite dos termos é tombado no Firestore usando timestamp do servidor (`serverTimestamp()`), formando uma evidência em caso de auditoria.
- **Diferenciação**: O componente React puxará o arquivo de configuração de Tour específico. Arquivo `instructor_tour.json` e `student_tour.json` mapeados globalmente na UI.

## 6. ROADMAP DE IMPLEMENTAÇÃO
- **Etapa 1:** Codificar o Container Visual (`OnboardingWizard.tsx`) com animações de Motion/React.
- **Etapa 2:** Criar o `OnboardingGuard` para proteger as rotas da aplicação (no `App.tsx`) contra usuários que não têm `primeiroAcessoCompleto: true`.
- **Etapa 3:** Criar as Tour Overlays (hints apontando pros botões reais renderizados pela plataforma).
