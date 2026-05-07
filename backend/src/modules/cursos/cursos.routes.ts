import { Router } from 'express';
import { cursoController } from './cursos.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware as any, cursoController.list as any);
router.post('/', authMiddleware as any, cursoController.create as any);

export default router;
