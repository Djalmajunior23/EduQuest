import { Router, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

const router = Router();

// Generic handler for tables not explicitly defined
// This is to maintain compatibility with Supabase-like api.from('table') calls
router.get('/:table', async (req: AuthRequest, res: Response) => {
  const { table } = req.params;
  const { id, uid, user_id, student_id, tenant_id } = req.query;

  try {
    const modelName = table
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
      .replace(/s$/, ''); // Very naive singularization

    // Manual mapping for known tables
    const tableToModel: Record<string, string> = {
      'perfis_aluno': 'Usuario',
      'planos_estudo': 'PlanoEstudo',
      'instituicao': 'Instituicao',
      'missoes': 'Badge'
    };

    const finalModelName = tableToModel[table] || modelName;
    const prismaKey = finalModelName.charAt(0).toLowerCase() + finalModelName.slice(1);

    if (!(prisma as any)[prismaKey]) {
      // If model not found, return empty data to not crash frontend
      return res.json({ success: true, data: [] });
    }

    const prismaModel = (prisma as any)[prismaKey];
    
    // Basic filter mapping
    const where: any = {};
    if (uid) where.id = uid;
    if (user_id) where.id = user_id;
    if (student_id) where.usuarioId = student_id;
    if (tenant_id) where.tenantId = tenant_id;

    const data = await prismaModel.findMany({ where });
    res.json({ success: true, data });
  } catch (error: any) {
    console.warn(`[GenericAPI] Error on table ${table}:`, error.message);
    res.json({ success: true, data: [] }); // Safe return
  }
});

export default router;
