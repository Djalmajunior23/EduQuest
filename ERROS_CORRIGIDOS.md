# Erros Corrigidos - EduQuest Enterprise AI

## 1. Backend e Servidor
- **Porta Dinâmica**: Fixada em `3000` para compatibilidade com o proxy do AI Studio, mantendo a variável `PORT` como fallback opcional.
- **Bind de Rede**: Configurado para `0.0.0.0` em vez de `localhost`.
- **Healthchecks**: Adicionadas rotas `/health` e `/api/health` para monitoramento de disponibilidade.
- **Rate Limiting**: Corrigido erro de validação de IP IPv6 no express-rate-limit definindo `validate: { xForwardedForHeader: false }`.
- **Sanitização Global**: Implementado middleware que sanitiza `body`, `query` e `params` contra XSS e injeções.

## 2. Banco de Dados e Prisma
- **Prisma Generate**: Executado com sucesso para sincronizar o cliente com o schema atual.
- **Conexão Assíncrona**: O servidor agora inicia mesmo se o banco estiver temporariamente indisponível, tentando reconectar em background sem travar o processo principal.
- **Seed de Dados**: Criado script robusto para cadastrar o Professor Djalma como administrador padrão.

## 3. Inteligência Artificial (EduJarvis)
- **Safe Mode**: Implementado fallback para o serviço de IA caso a `GEMINI_API_KEY` esteja ausente ou o serviço externo falhe.
- **Rate Limit IA**: Limite de 20 chamadas por hora por usuário para proteger a cota da API.

## 4. Frontend e Gráficos
- **NormalizeArray**: Aplicado em todos os loops `.map()` para evitar quebras de tela por valores `undefined` ou `null` vindos da API.
- **Dimensionamento de Gráficos**: Todos os containers de gráficos agora possuem altura mínima fixada via Tailwind (`min-h-[280px]`), resolvendo o erro "width(-1) and height(-1)".
- **Limpeza de Legado**: Removidas referências ativas a Supabase no código de produção (mantidas apenas em documentação técnica para fins de histórico).
