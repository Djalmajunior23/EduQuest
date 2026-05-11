import { PrismaClient } from '@prisma/client';

let databaseUrl = process.env.DATABASE_URL;

if (databaseUrl && databaseUrl.startsWith('https://')) {
  console.warn("[PRISMA] Alerta: DATABASE_URL iniciando com https://. Convertendo para postgresql://");
  databaseUrl = databaseUrl.replace('https://', 'postgresql://');
  // Atribuindo de volta à env para garantir consistência em outros módulos
  process.env.DATABASE_URL = databaseUrl;
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});
