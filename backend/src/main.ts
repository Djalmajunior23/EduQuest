import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import turmaRoutes from './modules/turmas/turmas.routes';
import atividadeRoutes from './modules/atividades/atividades.routes';
import cursoRoutes from './modules/cursos/cursos.routes';
import tenantRoutes from './modules/tenants/tenants.routes';
import simuladoRoutes from './modules/simulados/simulados.routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'eduquest-backend-v2' });
});

app.use('/api/auth', authRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/atividades', atividadeRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/simulados', simuladoRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/cursos', cursoRoutes);
// app.use('/api/atividades', atividadeRoutes);
// app.use('/api/simulados', simuladoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend V2 running on port ${PORT}`);
});
