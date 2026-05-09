import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;
      const result = await AuthService.login(email, senha);
      res.json({
        success: true,
        data: result,
        message: 'Login realizado com sucesso'
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message,
        code: 'AUTH_ERROR'
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        data: result,
        message: 'Cadastro realizado com sucesso'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
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
}
