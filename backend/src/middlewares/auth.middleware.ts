import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    perfil: string;
    tenantId?: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    const [, token] = authHeader.split(' ');
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    
    req.user = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      perfil: decoded.perfil,
      tenantId: decoded.tenantId
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token is invalid or expired' });
  }
};
