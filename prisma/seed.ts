import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@eduquest.com';
  
  // Check if admin already exists
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    
    // Create a default tenant if none exists
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: 'EduQuest Enterprise',
          limiteAlunos: 1000,
          limiteTokens: 1000000
        }
      });
    }

    await prisma.usuario.create({
      data: {
        nome: 'Professor Djalma',
        email: adminEmail,
        senhaHash: passwordHash,
        perfil: 'ADMIN',
        ativo: true,
        tenantId: tenant.id
      }
    });

    console.log('Test Admin User Created: admin@eduquest.com / Admin@123');
  }

  // Ensure common data exists
  const tenant = await prisma.tenant.findFirst();
  if (tenant) {
    // Create Example Course
    const course = await prisma.curso.upsert({
      where: { id: 'example-course-id' },
      update: {},
      create: {
        id: 'example-course-id',
        nome: 'Desenvolvimento de Sistemas',
        descricao: 'Curso focado em desenvolvimento full stack e IA.',
        tenantId: tenant.id
      }
    });

    // Create Example Turma
    await prisma.turma.upsert({
      where: { id: 'example-turma-id' },
      update: {},
      create: {
        id: 'example-turma-id',
        nome: 'DS-2024-T1',
        anoLetivo: 2024,
        semestre: 1,
        cursoId: course.id,
        tenantId: tenant.id
      }
    });

    // Create a student for testing
    const studentEmail = 'aluno@eduquest.com';
    const existingStudent = await prisma.usuario.findUnique({ where: { email: studentEmail } });
    if (!existingStudent) {
      const studentHash = await bcrypt.hash('Aluno@123', 10);
      await prisma.usuario.create({
        data: {
          nome: 'Fernando Aluno',
          email: studentEmail,
          senhaHash: studentHash,
          perfil: 'ALUNO',
          tenantId: tenant.id,
          turmaId: 'example-turma-id'
        }
      });
      console.log('Test Student User Created: aluno@eduquest.com / Aluno@123');
    }

    // Create initial badges
    const badges = [
      { nome: 'Primeiros Passos', descricao: 'Concluiu a primeira atividade.', icone: 'Zap' },
      { nome: 'Mestre da Lógica', descricao: 'Acertou 10 questões de algoritmos.', icone: 'Brain' },
      { nome: 'Explorador IA', descricao: 'Usou o EduJarvis 5 vezes.', icone: 'Bot' }
    ];

    for (const b of badges) {
       await prisma.badge.upsert({
         where: { id: b.nome.toLowerCase().replace(/ /g, '-') },
         update: {},
         create: {
           id: b.nome.toLowerCase().replace(/ /g, '-'),
           nome: b.nome,
           descricao: b.descricao,
           icone: b.icone,
           tenantId: tenant.id
         }
       });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
