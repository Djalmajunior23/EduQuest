import { api } from '../lib/api';


import { IntegrationProviderConfig } from '../types/integracoes';export const integrationService = {
  async getIntegrationsByTenant(tenantId: string): Promise<IntegrationProviderConfig[]> {
    const { data, error } = await api
      .from('config_integracoes')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      tenantId: d.tenant_id,
      updatedAt: d.updated_at,
      updatedBy: d.updated_by
    } as IntegrationProviderConfig));
  },
  
  async saveIntegration(config: Partial<IntegrationProviderConfig>, userId: string): Promise<void> {
    const dataToSave = {
      ...config,
      tenant_id: config.tenantId,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };

    // Remove client-side only fields or those with different casing
    delete (dataToSave as any).tenantId;
    delete (dataToSave as any).updatedAt;
    delete (dataToSave as any).updatedBy;

    const { data: savedData, error: saveError } = await api
      .from('config_integracoes')
      .upsert(dataToSave)
      .select()
      .maybeSingle();

    if (saveError) throw saveError;
    
    // Log audit
    const { error: logError } = await api
      .from('audit_integracoes')
      .insert({
        tenant_id: config.tenantId,
        acao: config.id ? 'UPDATE' : 'CREATE',
        user_id: userId,
        created_at: new Date().toISOString()
      });
    
    if (logError) console.error('Error logging integration audit:', logError);
  }
};
