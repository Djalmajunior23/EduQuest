# Checklist de Deploy - EduQuest

## Pré-requisitos
- [ ] Banco de Dados PostgreSQL (Neon) configurado.
- [ ] `GEMINI_API_KEY` gerada no Google AI Studio.
- [ ] Variáveis `.env` configuradas no servidor/VPS.

## Fluxo de Deploy
1. **Instalação**: `npm install`
2. **Prisma**: `npx prisma generate` && `npx prisma db push`
3. **Seed**: `npm run seed` (para criar admin inicial)
4. **Build**: `npm run build`
5. **Start**: `npm run start`

## Configuração Docker (Opcional)
- O `Dockerfile` e `docker-compose.yml` estão prontos para uso com Traefik.
- Certifique-se de expor a porta `3000`.
