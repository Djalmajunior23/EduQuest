import { Router } from 'express';
import { turmaController } from './turmas.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware as any, turmaController.list as any);
router.post('/', authMiddleware as any, turmaController.create as any);
router.get('/:id', authMiddleware as any, turmaController.getById as any);

export default router;
