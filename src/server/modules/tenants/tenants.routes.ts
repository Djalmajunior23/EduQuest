import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.user?.tenantId }
    });
    res.json({ success: true, data: tenant });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
