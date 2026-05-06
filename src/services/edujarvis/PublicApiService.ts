// src/services/edujarvis/PublicApiService.ts
import { supabase } from '../../lib/supabase';
import crypto from 'crypto';

export interface ApiKeyRecord {
  id?: string;
  tenantId: string;
  key: string;
  label: string;
  scopes: string[];
  lastUsedAt?: any;
  createdAt: any;
}

export class PublicApiService {
  private static TABLE = 'tenant_api_keys';

  /**
   * Gera uma nova chave de API pública para integração externa (LMS, ERP).
   */
  public static async generateKey(tenantId: string, label: string): Promise<string> {
    const key = `sk_live_${crypto.randomUUID().replace(/-/g, '')}`;
    const { error } = await supabase.from(this.TABLE).insert({
      tenant_id: tenantId,
      key,
      label,
      scopes: ['chat', 'reports', 'assessments'],
      created_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return key;
  }

  /**
   * Valida uma chave de API vinda de uma requisição externa.
   */
  public static async validateKey(key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from(this.TABLE)
      .select('tenant_id')
      .eq('key', key)
      .maybeSingle();
    
    if (error) throw error;
    return data?.tenant_id || null;
  }

  /**
   * Revoga uma chave de API.
   */
  public static async revokeKey(docId: string) {
    const { error } = await supabase
      .from(this.TABLE)
      .delete()
      .eq('id', docId);
    
    if (error) throw error;
  }
}
