# Relatório de Estado Atual - EduQuest Enterprise AI

## 1. Estrutura do Projeto
- **Monorepo (Frontend + Backend)**: O projeto utiliza Vite para o frontend e Express para o backend no mesmo repositório.
- **Frontend**: React 19, Tailwind CSS 4, Recharts, Lucide Icons.
- **Backend**: Node.js/Express, Prisma ORM, JWT, Helmet.
- **Banco de Dados**: PostgreSQL (Neon).
- **IA**: Google Generative AI (EduJarvis).

## 2. Dependências
- **Vincunladas**: `@google/genai`, `@prisma/client`, `express`, `react-router-dom`, `recharts`, `motion`.
- **Status**: As dependências fundamentais estão presentes no `package.json`.

## 3. Configurações de Ambiente
- Operando com fallback para `GEMINI_API_KEY` (Safe Mode).
- Porta hardcoded para `3000` no `server.ts` para compatibilidade com o AI Studio Proxy.
- Healthchecks implementados em `/api/health`.

## 4. Problemas Identificados
- **Legado**: Há referências a Firebase em documentação e strings de texto em módulos de visualização.
- **Segurança**: Rate limits configurados mas podem precisar de ajustes finos.
- **Sincronização**: O frontend espera algumas tabelas que podem não estar refletidas perfeitamente no Prisma schema (ex: `perfis_aluno` mapeado genericamente).
- **Gráficos**: Alguns gráficos podem ainda apresentar erro de dimensionamento se o container pai não estiver fixo.

## 5. Próximos Passos
- Refinar a limpeza de códigos mortos.
- Garantir que todos os loops de renderização usem `normalizeArray`.
- Validar a conexão Prisma no startup.
- Implementar logs de auditoria mais robustos.
