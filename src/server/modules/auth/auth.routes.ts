import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/me', authMiddleware as any, AuthController.me as any);
router.post('/logout', AuthController.logout);

export default router;
