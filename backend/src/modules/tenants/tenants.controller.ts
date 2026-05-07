import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class TenantController {
  
  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      // Basic security: user can only see their own tenant unless admin
      if (req.user?.perfil !== 'ADMIN' && req.user?.tenantId !== id) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      const tenant = await prisma.tenant.findUnique({
        where: { id }
      });

      if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

      return res.json(tenant);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, branding } = req.body;

      if (req.user?.perfil !== 'ADMIN' && req.user?.tenantId !== id) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      const tenant = await prisma.tenant.update({
        where: { id },
        data: { name, branding: branding || undefined }
      });

      return res.json(tenant);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating tenant' });
    }
  }
}

export const tenantController = new TenantController();
