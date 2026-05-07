import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../../config/env';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  
  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;
      
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }
      
      const existingUser = await prisma.usuario.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'E-mail já está em uso' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      
      // Criar usuário no tenant base
      let tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        tenant = await prisma.tenant.create({ data: { name: 'Default Tenant' } });
      }

      const newUser = await prisma.usuario.create({
        data: {
          nome,
          email,
          senhaHash,
          tenantId: tenant.id
        }
      });
      
      return res.status(201).json({ message: 'Usuário registrado com sucesso', user: { id: newUser.id, nome: newUser.nome, email: newUser.email } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;
      
      if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
      }
      
      const user = await prisma.usuario.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      const match = await bcrypt.compare(senha, user.senhaHash);
      if (!match) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      await prisma.usuario.update({
        where: { id: user.id },
        data: { ultimoLoginEm: new Date() }
      });

      const token = jwt.sign(
        { sub: user.id, email: user.email, perfil: user.perfil, tenantId: user.tenantId },
        env.JWT_SECRET as jwt.Secret,
        { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
      );
      
      return res.json({
        accessToken: token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          perfil: user.perfil
        }
      });
      
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      
      const user = await prisma.usuario.findUnique({
        where: { id: req.user.id },
        include: { tenant: true }
      });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      
      return res.json({ 
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          perfil: user.perfil
        } 
      });
    } catch(err) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('eduquest_token');
    return res.json({ message: 'Logout realizado com sucesso' });
  }

  async refresh(req: Request, res: Response) {
     return res.json({ message: 'Not implemented' });
  }

  async forgotPassword(req: Request, res: Response) {
    return res.json({ message: 'Not implemented' });
  }

  async resetPassword(req: Request, res: Response) {
    return res.json({ message: 'Not implemented' });
  }
}

export const authController = new AuthController();
