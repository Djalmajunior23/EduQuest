import { collection, addDoc, serverTimestamp, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
    await addDoc(collection(db, 'logs'), {
      ...log,
      dataHora: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
}

/**
 * Updates a user's profile and logs the change.
 */
export async function updateUserProfile(userId: string, data: any, responsibleId: string) {
  const userRef = doc(db, 'usuarios', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: responsibleId
  });

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
  const userRef = doc(db, 'usuarios', userId);
  await updateDoc(userRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
    updatedBy: responsibleId
  });

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
 * This triggers a hypothetical email sending process (via n8n or generic API).
 */
export async function inviteUser(data: { nome: string; email: string; perfil: string; turmaId?: string }, responsibleId: string) {
  // 1. Create a invitation token (mocked simple token)
  const invitationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // 2. Register invitation in Firestore
  const invitationRef = await addDoc(collection(db, 'convites'), {
    ...data,
    token: invitationToken,
    status: 'ENVIADO',
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    createdBy: responsibleId
  });

  // 3. Register user as PENDING (if doesn't exist)
  // Note: For now, we only create the invitation record.
  // In a real system, we might pre-create the user or just wait for the invitation to be accepted.
  
  // 4. Log the action
  await logAction({
    acao: 'USER_INVITED',
    usuarioAfetadoId: 'NEW_USER',
    usuarioResponsavelId: responsibleId,
    descricao: `Convite enviado para ${data.email} (${data.perfil})`,
    detalhes: { ...data, invitationToken }
  });

  // 5. Trigger n8n integration (Hypothetical)
  // For this environment, we simulate the fetch
  // Email sending mocked out
  
  return invitationRef.id;
}

/**
 * Blocks or Unblocks a user account (Admin only logic)
 */
export async function setBlockAccount(userId: string, isBlocked: boolean, responsibleId: string, reason: string) {
  const newStatus = isBlocked ? 'BLOQUEADO' : 'ATIVO';
  const userRef = doc(db, 'usuarios', userId);
  await updateDoc(userRef, { 
    status: newStatus,
    observacoes: `[${new Date().toLocaleDateString()}] ${reason}`,
    updatedAt: serverTimestamp(),
    updatedBy: responsibleId
  });

  await logAction({
    acao: isBlocked ? 'ACCOUNT_BLOCKED' : 'ACCOUNT_UNBLOCKED',
    usuarioAfetadoId: userId,
    usuarioResponsavelId: responsibleId,
    descricao: isBlocked ? `Conta bloqueada: ${reason}` : `Conta desbloqueada: ${reason}`,
    detalhes: { reason }
  });
}

/**
 * Batch import users from CSV/JSON (Concept Architecture)
 */
export async function importUsersBatch(users: any[], responsibleId: string) {
  const batch = writeBatch(db);
  const results = { success: 0, failed: 0 };
  
  for (const user of users) {
    try {
      const newUserRef = doc(collection(db, 'usuarios'));
      batch.set(newUserRef, {
        ...user,
        status: 'PENDENTE',
        createdAt: serverTimestamp(),
        createdBy: responsibleId
      });
      results.success++;
    } catch {
      results.failed++;
    }
  }

  await batch.commit();

  await logAction({
    acao: 'BATCH_IMPORT',
    usuarioAfetadoId: 'MULTIPLE',
    usuarioResponsavelId: responsibleId,
    descricao: `Importação em lote concluída: ${results.success} registros`,
    detalhes: { importedCount: results.success }
  });

  // Hypothetical n8n Trigger for batch welcome emails
  // Trigger hypotetical n8n webhook (mocked)

  return results;
}
