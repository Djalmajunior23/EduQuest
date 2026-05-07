import { api } from '../lib/api';



export interface AuditLog {
  acao: string;
  usuarioAfetadoId: string;
  usuarioResponsavelId: string;
  descricao: string;
  detalhes?: any;
}

/**
 * Registers an action in the system audit logs.
 */
export async function logAction(log: AuditLog) {
  try {
    await api.from('logs').insert({
      ...log,
      data_hora: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
}

/**
 * Updates a user's profile and logs the change.
 */
export async function updateUserProfile(userId: string, data: any, responsibleId: string) {
  const { error } = await api
    .from('usuarios')
    .update({
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: responsibleId
    })
    .eq('uid', userId);

  if (error) throw error;

  await logAction({
    acao: 'USER_UPDATE',
    usuarioAfetadoId: userId,
    usuarioResponsavelId: responsibleId,
    descricao: `Perfil atualizado: ${Object.keys(data).join(', ')}`,
    detalhes: data
  });
}

/**
 * Changes a user's status (Activate/Deactivate).
 */
export async function toggleUserStatus(userId: string, newStatus: string, responsibleId: string) {
  const { error } = await api
    .from('usuarios')
    .update({
      status: newStatus,
      updatedAt: new Date().toISOString(),
      updatedBy: responsibleId
    })
    .eq('uid', userId);

  if (error) throw error;

  await logAction({
    acao: 'STATUS_CHANGE',
    usuarioAfetadoId: userId,
    usuarioResponsavelId: responsibleId,
    descricao: `Status alterado para ${newStatus}`,
    detalhes: { newStatus }
  });
}

/**
 * Creates an invitation and registers it in the system.
 */
export async function inviteUser(data: { nome: string; email: string; perfil: string; turmaId?: string }, responsibleId: string) {
  const invitationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const { data: invitation, error } = await api
    .from('convites')
    .insert({
      ...data,
      token: invitationToken,
      status: 'ENVIADO',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: responsibleId
    })
    .select()
    .maybeSingle();

  if (error) throw error;

  await logAction({
    acao: 'USER_INVITED',
    usuarioAfetadoId: 'NEW_USER',
    usuarioResponsavelId: responsibleId,
    descricao: `Convite enviado para ${data.email} (${data.perfil})`,
    detalhes: { ...data, invitationToken }
  });

  return invitation.id;
}

/**
 * Blocks or Unblocks a user account (Admin only logic)
 */
export async function setBlockAccount(userId: string, isBlocked: boolean, responsibleId: string, reason: string) {
  const newStatus = isBlocked ? 'BLOQUEADO' : 'ATIVO';
  const { error } = await api
    .from('usuarios')
    .update({ 
      status: newStatus,
      observacoes: `[${new Date().toLocaleDateString()}] ${reason}`,
      updatedAt: new Date().toISOString(),
      updatedBy: responsibleId
    })
    .eq('uid', userId);

  if (error) throw error;

  await logAction({
    acao: isBlocked ? 'ACCOUNT_BLOCKED' : 'ACCOUNT_UNBLOCKED',
    usuarioAfetadoId: userId,
    usuarioResponsavelId: responsibleId,
    descricao: isBlocked ? `Conta bloqueada: ${reason}` : `Conta desbloqueada: ${reason}`,
    detalhes: { reason }
  });
}

/**
 * Batch import users from CSV/JSON */
export async function importUsersBatch(users: any[], responsibleId: string) {  const preparedUsers = (users || []).map(user => ({
    ...user,
    status: 'PENDENTE',
    created_at: new Date().toISOString(),
    created_by: responsibleId
  }));

  const { data, error } = await api
    .from('usuarios')
    .insert(preparedUsers);

  if (error) throw error;

  const successCount = preparedUsers.length;

  await logAction({
    acao: 'BATCH_IMPORT',
    usuarioAfetadoId: 'MULTIPLE',
    usuarioResponsavelId: responsibleId,
    descricao: `Importação em lote concluída: ${successCount} registros`,
    detalhes: { importedCount: successCount }  });

  return { success: successCount, failed: 0 };
}
