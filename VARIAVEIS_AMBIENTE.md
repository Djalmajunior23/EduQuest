# Variáveis de Ambiente - EduQuest Enterprise AI

Este documento detalha as variáveis necessárias para o funcionamento pleno do sistema. Nenhuma variável opcional impedirá a inicialização (startup) do sistema.

## 1. Variáveis Obrigatórias (Críticas)
| Variável | Descrição | Valor Sugerido |
| :--- | :--- | :--- |
| `DATABASE_URL` | String de conexão com Neon PostgreSQL | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Chave mestra para assinatura de tokens | Uma string aleatória complexa |
| `GEMINI_API_KEY` | Chave de API do Google Gemini | Chave vinda do Google AI Studio |

## 2. Variáveis de Frontend (Vite)
| Variável | Descrição | Valor Sugerido |
| :--- | :--- | :--- |
| `VITE_API_URL` | Endpoint base da API | `/api` |
| `VITE_APP_ENV` | Ambiente da aplicação | `development` ou `production` |

## 3. Variáveis Opcionais (Serviços Externos)
| Variável | Descrição | Fallback do Sistema |
| :--- | :--- | :--- |
| `RESEND_API_KEY` | Integração de e-mail transacional | E-mail desativado (logado no console) |
| `N8N_WEBHOOK_URL` | Automação de fluxos pedagógicos | Webhook ignorado |
| `BREVO_API_KEY` | Alternativa para envio de e-mails | Ignorado |

## 4. Configuração de Rede
- O sistema escuta na porta `3000` (fixa para AI Studio) ou via `process.env.PORT`.
- O bind é feito em `0.0.0.0` para permitir acesso externo.
