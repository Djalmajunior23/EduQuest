import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/config';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    perfil: string;
    tenantId: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  // Only accept Authorization header (Bearer token)
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Validate required fields in token
    if (!decoded.id || !decoded.perfil) {
      console.error("Token malformado (missing id or perfil) - decoded:", decoded);
      return res.status(401).json({ error: 'Token malformado' });
    }
    
    // Allow missing tenantId for now, handle it later if it's needed

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sessão expirada ou inválida' });
  }
};

/**
 * Middleware para exigir permissões específicas (RBAC)
 */
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação requerida' });
    }

    if (!roles.includes(req.user.perfil)) {
      return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
    }

    next();
  };
};
