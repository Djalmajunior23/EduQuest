import { Router } from 'express';
import { tenantController } from './tenants.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/:id', authMiddleware as any, tenantController.getById as any);
router.put('/:id', authMiddleware as any, tenantController.update as any);

export default router;
