import { Router } from 'express';
import { atividadeController } from './atividades.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware as any, atividadeController.list as any);
router.post('/', authMiddleware as any, atividadeController.create as any);
router.get('/:id', authMiddleware as any, atividadeController.getById as any);
router.post('/:id/submit', authMiddleware as any, atividadeController.submit as any);

export default router;
