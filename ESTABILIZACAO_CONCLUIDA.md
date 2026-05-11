# Estabilização Concluída - EduQuest Enterprise AI

Todas as pendências críticas para o funcionamento do applet no Google AI Studio foram resolvidas.

## 1. Segurança e CSP
- **Framing**: Adicionado `https://aistudio.google.com` ao `frame-ancestors` na CSP do servidor.
- **WebSocket HMR**: Desativado no `vite.config.ts` para evitar bloqueios de porta pela CSP do AI Studio.
- **Trust Proxy**: Configurado `app.set('trust proxy', true)` para correta identificação de IPs via proxy do Google.

## 2. Autenticação e Sessão
- **postMessage Listener**: Adicionado suporte no `AuthContext.tsx` para capturar tokens injetados pelo AI Studio automaticamente.
- **Persistência**: O token é armazenado no `localStorage` sob a chave `eduquest_token`.
- **Validação de IPs**: `express-rate-limit` configurado para não falhar em endereços IPv6.

## 3. Dados e Usuários (Seed)
Os seguintes usuários foram configurados com a senha `password123`:
- **Admin**: `admin@eduquest.test`
- **Professor**: `professor@eduquest.test`
- **Aluno**: `aluno@eduquest.test`

## 4. Estabilidade do Frontend
- **NormalizeArray**: Aplicado em loops críticos para evitar erros de renderização com dados nulos.
- **Error Handling**: Melhora na captura e reporte de erros de rede via `api.ts`.

## 5. Saúde do Sistema
- **Scripts de Healthcheck**: Atualizados para apontar para a porta `3000` (padrão AI Studio).
- **Logs**: Mudança para formato `dev` no morgan para facilitar debug em tempo real.

O sistema está pronto para uso e testes internos.
