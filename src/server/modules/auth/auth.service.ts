import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../lib/config';
import { emailService } from '../../services/email/email.service';

export class AuthService {
  // ... existing methods ...
  static async requestPasswordReset(email: string) {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return; // Silent return for security

    const resetToken = jwt.sign(
      { id: user.id, purpose: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetUrl = `${process.env.APP_URL || process.env.VITE_APP_URL || ''}/reset-password?token=${resetToken}`;

    await emailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  static async resetPassword(token: string, newPassword: string) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded.purpose !== 'password_reset') {
        throw new Error('Token inválido');
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.usuario.update({
        where: { id: decoded.id },
        data: { senhaHash: hashed }
      });
    } catch (error) {
      throw new Error('Link expirado ou inválido');
    }
  }

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
