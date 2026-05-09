import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthService {
  static async login(email: string, senhaHash: string) {
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { tenant: true }
    });

    if (!user || !user.ativo) {
      throw new Error('Usuário não encontrado ou inativo');
    }

    const isMatch = await bcrypt.compare(senhaHash, user.senhaHash);
    if (!isMatch) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        perfil: user.perfil,
        tenantId: user.tenantId 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // Update last login
    await prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoLoginEm: new Date() }
    });

    const { senhaHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken: token };
  }

  static async register(data: { email: string, senha: string, nome: string, perfil?: any }) {
    const existing = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('E-mail já cadastrado');
    }

    // Default tenant for self-registration if necessary, or assign to a default
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: 'EduQuest Free Tier',
          statusAssinatura: 'ATIVA'
        }
      });
    }

    const hashed = await bcrypt.hash(data.senha, 10);
    const user = await prisma.usuario.create({
      data: {
        email: data.email,
        nome: data.nome,
        senhaHash: hashed,
        perfil: data.perfil || 'ALUNO',
        tenantId: tenant.id
      }
    });

    const { senhaHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getMe(userId: string) {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: { 
        tenant: true,
        turma: {
           include: { curso: true }
        }
      }
    });
    if (!user) throw new Error('Usuário não encontrado');
    const { senhaHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
