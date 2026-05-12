import { prisma } from './prisma';

function normalizeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");
}

async function platformEmailExists(email: string) {
  const user = await prisma.usuario.findUnique({
    where: { platform_email: email },
  });
  return !!user;
}

export async function generatePlatformEmail(fullName: string, role: string) {
  const domain = process.env.PLATFORM_EMAIL_DOMAIN || "edstudenthub.com";

  let base = normalizeName(fullName);

  if (!base || base.length < 3) {
    base = `${role.toLowerCase()}.${Date.now()}`;
  }

  let email = `${base}@${domain}`;
  let counter = 1;

  while (await platformEmailExists(email)) {
    email = `${base}.${counter}@${domain}`;
    counter++;
  }

  return email;
}
