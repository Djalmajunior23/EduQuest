import { Router } from 'express';
import { simuladoController } from './simulados.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware as any, simuladoController.list as any);
router.post('/', authMiddleware as any, simuladoController.create as any);
router.get('/:id', authMiddleware as any, simuladoController.getById as any);

export default router;
