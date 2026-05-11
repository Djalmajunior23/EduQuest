import { PrismaClient, PerfilUsuario } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed: Iniciando cadastros básicos...');

  // 1. Criar Tenant Principal
  const tenant = await prisma.tenant.upsert({
    where: { domain: 'nexusinstitute.edu.br' },
    update: {},
    create: {
      name: 'Nexus Institute of Technology',
      domain: 'nexusinstitute.edu.br',
      statusAssinatura: 'ATIVA',
      limiteAlunos: 1000,
      limiteTokens: 1000000,
      branding: {
        primaryColor: '#6366f1',
        logoUrl: '/logo.png'
      }
    },
  });

  console.log(`Tenant criado/verificado: ${tenant.name}`);

  // 2. Criar Instituição
  await prisma.instituicao.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      nome: 'Unidade Central São Paulo',
      cnpj: '12.345.678/0001-90',
      endereco: 'Av. Paulista, 1000 - SP',
      tenantId: tenant.id
    }
  });

  // 3. Criar Administrador
  const adminEmail = 'admin@eduquest.test';
  const adminSenha = 'password123';
  const hashedSenha = await bcrypt.hash(adminSenha, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {
        senhaHash: hashedSenha,
        perfil: 'ADMIN' as PerfilUsuario
    },
    create: {
      nome: 'Administrador EduQuest',
      email: adminEmail,
      senhaHash: hashedSenha,
      perfil: 'ADMIN' as PerfilUsuario,
      tenantId: tenant.id,
      ativo: true
    },
  });

  console.log(`Usuário Admin: ${admin.email} / Senha: ${adminSenha}`);

  // 4. Criar Professor de Exemplo
  const profEmail = 'professor@eduquest.test';
  const profSenha = 'password123';
  const hashedProfSenha = await bcrypt.hash(profSenha, 10);

  await prisma.usuario.upsert({
    where: { email: profEmail },
    update: {
        senhaHash: hashedProfSenha,
        perfil: 'PROFESSOR' as PerfilUsuario
    },
    create: {
      nome: 'Professor de Teste',
      email: profEmail,
      senhaHash: hashedProfSenha,
      perfil: 'PROFESSOR' as PerfilUsuario,
      tenantId: tenant.id,
      ativo: true
    }
  });

  // 5. Criar Aluno de Exemplo
  const alunoEmail = 'aluno@eduquest.test';
  const alunoSenha = 'password123';
  const hashedAlunoSenha = await bcrypt.hash(alunoSenha, 10);

  await prisma.usuario.upsert({
    where: { email: alunoEmail },
    update: {
        senhaHash: hashedAlunoSenha,
        perfil: 'ALUNO' as PerfilUsuario
    },
    create: {
      nome: 'Aluno de Teste',
      email: alunoEmail,
      senhaHash: hashedAlunoSenha,
      perfil: 'ALUNO' as PerfilUsuario,
      tenantId: tenant.id,
      ativo: true
    }
  });

  console.log('Seed: Cadastro concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
