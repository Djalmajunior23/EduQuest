import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

const registerSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  nome: z.string().min(2, 'Nome muito curto'),
  tenantId: z.string().optional(),
  perfil: z.enum(['ALUNO', 'PROFESSOR', 'GESTOR', 'ADMIN']).default('ALUNO')
});

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, senha } = loginSchema.parse(req.body);
      const result = await AuthService.login(email, senha);
      
      res.json({
        success: true,
        data: {
          user: result.user,
          token: result.accessToken 
        },
        message: 'Login realizado com sucesso'
      });
    } catch (error: any) {
      const message = error instanceof z.ZodError ? error.issues[0].message : error.message;
      res.status(401).json({
        success: false,
        error: message,
        code: 'AUTH_ERROR'
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedData);
      res.status(201).json({
        success: true,
        data: result,
        message: 'Cadastro realizado com sucesso'
      });
    } catch (error: any) {
      const message = error instanceof z.ZodError ? error.issues[0].message : error.message;
      res.status(400).json({
        success: false,
        error: message,
        code: 'REGISTER_ERROR'
      });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) throw new Error('Não autorizado');
      const user = await AuthService.getMe(req.user.id);
      res.json({
        success: true,
        data: { user },
        message: 'Perfil recuperado'
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message,
        code: 'UNAUTHORIZED'
      });
    }
  }

  static async logout(req: Request, res: Response) {
    res.json({
      success: true,
      message: 'Logout realizado'
    });
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await AuthService.requestPasswordReset(email);
      res.json({
        success: true,
        message: 'Se o e-mail existir, um link de recuperação será enviado.'
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      await AuthService.resetPassword(token, newPassword);
      res.json({
        success: true,
        message: 'Senha redefinida com sucesso.'
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
