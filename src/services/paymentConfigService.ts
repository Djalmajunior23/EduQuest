// src/services/paymentConfigService.ts
import { supabase } from '../lib/supabase';
import { PaymentProviderConfig } from '../types/payment';

export const paymentConfigService = {
  async getProvidersByTenant(tenantId: string): Promise<PaymentProviderConfig[]> {
    const { data, error } = await supabase
      .from('config_pagamentos')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      tenantId: d.tenant_id,
      updatedAt: d.updated_at,
      updatedBy: d.updated_by
    } as PaymentProviderConfig));
  },
  
  async saveProvider(config: Partial<PaymentProviderConfig>, userId: string): Promise<void> {
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

    const { error: saveError } = await supabase
      .from('config_pagamentos')
      .upsert(dataToSave);

    if (saveError) throw saveError;
    
    // Log audit
    const { error: logError } = await supabase
      .from('audit_pagamentos')
      .insert({
        tenant_id: config.tenantId,
        acao: config.id ? 'UPDATE' : 'CREATE',
        user_id: userId,
        created_at: new Date().toISOString()
      });
    
    if (logError) console.error('Error logging payment audit:', logError);
  }
};
